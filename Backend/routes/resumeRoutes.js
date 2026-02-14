import dotenv from "dotenv";

dotenv.config();
import express from "express";
import multer from "multer";
// import { PDFParse } from 'pdf-parse';
import PdfParse from "pdf-parse-new";
import docxParser from "docx-parser";
import OpenAI from "openai";
import fs from "fs";
import Resume from "../models/Resume.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
console.log("OpenAI Key Loaded:", process.env.OPENAI_API_KEY ? "✅ Yes" : "❌ No");

// Create OpenAI client only if the key is available. This prevents the
// SDK from throwing the "Missing credentials" error at runtime and gives
// a clearer log message for debugging.
let client = null;
if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
  });
} else {
  console.error(
    "OPENAI_API_KEY is missing. Please add it to .env or set the environment variable."
  );
}
// console.log(client);

// Convert DOCX to text
const extractDocxText = (filePath) =>
  new Promise((resolve, reject) => {
    docxParser.parseDocx(filePath, (data) => {
      if (!data) reject("Error parsing DOCX");
      resolve(data);
    });
  });

// Resume Upload + AI Analysis
router.post("/upload", auth, upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    const buffer = fs.readFileSync(filePath);
    let resumeText = "";

    // Extract resume text based on file type
    if (fileType.includes("pdf")) {
      // const data = new PDFParse({url:buffer});
      // resumeText = (await data.getText()).text;
      const data = await PdfParse(buffer);
      resumeText = data.text;
    } else if (fileType.includes("word")) {
      resumeText = await extractDocxText(filePath);
    } else {
      return res.status(400).json({ message: "Unsupported file type ❌" });
    }
    
    // Ensure OpenAI client is configured before calling it
    if (!client) {
      
      return res
        .status(500)
        .json({ message: "OpenAI API key not configured on server. Contact admin." });
    }

    console.log(resumeText);
    console.log(jobDescription);
    

    // Call OpenAI for scoring
    const prompt = `
You are a professional resume evaluator.
Compare the following resume to the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return results in this JSON format only:
{
  "score": number (0-100),
  "strengths": ["point1", "point2"],
  "improvements": ["point1", "point2", "point3"]
}
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini", // Use GPT-5 if available: "gpt-5"
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);
    console.log(aiResponse);
    
    const saved = await Resume.create({
      userId: req.user,
      resumeFile: req.file.filename,
      jobDescription,
      analysis: aiResponse,
    });

    res.json({
      message: "Resume analyzed successfully ✅",
      data: saved,
    });
  } catch (error) {
    console.error(error);
    res.json({ message: "AI Analysis Failed ❌", error: error.message });
  }
});

// Get Latest Resume Review
router.get("/latest", auth, async (req, res) => {
  try {
    const latestResume = await Resume.find({ userId: req.user })
      .sort({ createdAt: -1 });

    if (!latestResume) {
      return res.status(404).json({ message: "No resume review found" });
    }

    res.json(latestResume);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch resume review" });
  }
});


export default router;
