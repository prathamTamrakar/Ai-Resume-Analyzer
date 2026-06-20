import express from "express";
import multer from "multer";
import PdfParse from "pdf-parse-new";
import docxParser from "docx-parser";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import Resume from "../models/Resume.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({ storage });

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const extractDocxText = (filePath) =>
  new Promise((resolve, reject) => {
    docxParser.parseDocx(filePath, (data) => {
      if (!data) reject("Error parsing DOCX");
      resolve(data);
    });
  });

router.post("/upload", auth, upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    const buffer = fs.readFileSync(filePath);
    let resumeText = "";

    if (fileType.includes("pdf")) {
      const data = await PdfParse(buffer);
      resumeText = data.text;
    } else if (fileType.includes("word")) {
      resumeText = await extractDocxText(filePath);
    } else {
      return res.status(400).json({ message: "Unsupported file type ❌" });
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) and professional resume evaluator.

Analyze the resume against the job description below and return a detailed JSON evaluation.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment of the candidate's fit for this role>",
  "strengths": [
    "<specific strength with evidence from the resume>",
    "<specific strength with evidence from the resume>",
    "<specific strength with evidence from the resume>"
  ],
  "improvements": [
    "<specific gap or weakness relative to the job description>",
    "<specific gap or weakness relative to the job description>",
    "<specific gap or weakness relative to the job description>"
  ],
  "suggestions": [
    "<concrete, actionable suggestion to improve the resume for this role>",
    "<concrete, actionable suggestion to improve the resume for this role>",
    "<concrete, actionable suggestion to improve the resume for this role>"
  ],
  "keywords": {
    "matched": ["<keyword from JD found in resume>", "..."],
    "missing": ["<important keyword from JD not found in resume>", "..."]
  }
}

Scoring guide:
- 85-100: Excellent match, most requirements met
- 70-84: Good match, minor gaps
- 50-69: Moderate match, notable gaps
- Below 50: Poor match, significant gaps
`;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    const saved = await Resume.create({
      userId: req.user,
      resumeFile: req.file.filename,
      originalFileName: req.file.originalname,
      jobDescription,
      analysis: aiResponse,
    });

    res.json({
      message: "Resume analyzed successfully ✅",
      data: saved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI Analysis Failed ❌", error: error.message });
  }
});

router.get("/latest", auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user }).sort({ createdAt: -1 });

    if (!resumes || resumes.length === 0) {
      return res.status(404).json({ message: "No resume review found" });
    }

    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch resume review" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Delete the stored file from disk
    const filePath = `uploads/${resume.resumeFile}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Resume.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
});

export default router;
