import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: String,
  resumeFile: String,
  originalFileName: String,
  jobDescription: String,
  analysis: Object,
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
