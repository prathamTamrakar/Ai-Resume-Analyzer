import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: String,
  resumeFile: String,
  jobDescription: String,
  analysis: Object,
});

export default mongoose.model("Resume", resumeSchema);
