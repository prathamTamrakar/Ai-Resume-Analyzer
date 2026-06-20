import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, ChevronDown, X } from "lucide-react";
import FileDropZone from "../components/FileDropZone";
import { useToast } from "../components/Toast";
import jobTemplates from "../data/jobTemplates.js";

const UPLOAD_STEPS = [
  "Uploading your resume...",
  "AI is reading your content...",
  "Scoring and generating insights...",
  "Almost done...",
];

export default function UploadResume() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showAllRoles, setShowAllRoles] = useState(false);

  useEffect(() => {
    if (!isUploading) {
      setStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, UPLOAD_STEPS.length - 1));
    }, 2800);
    return () => clearInterval(interval);
  }, [isUploading]);

  const handleRoleSelect = (template) => {
    if (selectedRole === template.role) {
      setSelectedRole(null);
      setJobDescription("");
    } else {
      setSelectedRole(template.role);
      setJobDescription(template.description);
    }
  };

  const handleClearDescription = () => {
    setSelectedRole(null);
    setJobDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription.trim()) {
      showError("Please upload a resume and enter a job description.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Please log in first.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    setIsUploading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resume/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showSuccess("Resume analyzed successfully!");
      navigate("/results");
    } catch (error) {
      console.error(error);
      showError("Upload or AI processing failed. Please try again.");
      setIsUploading(false);
    }
  };

  const visibleRoles = showAllRoles ? jobTemplates : jobTemplates.slice(0, 6);

  return (
    <div className="min-h-screen bg-(--color-bg) p-6 flex justify-center items-start pt-16">
      <div className="bg-white shadow-(--shadow-card) rounded-2xl p-8 sm:p-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-(--color-text)">Upload Your Resume</h2>
          <p className="text-(--color-muted) mt-2">
            Paste a job description or pick a role template to get a tailored AI score.
          </p>
        </div>

        {isUploading ? (
          <div className="flex flex-col items-center gap-6 py-12">
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-(--color-text)">
                {UPLOAD_STEPS[stepIndex]}
              </p>
              <p className="text-sm text-(--color-muted) mt-1">
                This usually takes 10–20 seconds
              </p>
            </div>
            <div className="flex items-center gap-2">
              {UPLOAD_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i <= stepIndex ? "w-8 bg-indigo-500" : "w-3 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FileDropZone
              file={resumeFile}
              onFileChange={setResumeFile}
              accept=".pdf,.doc,.docx"
            />

            {/* Role Templates */}
            <div>
              <p className="text-sm font-medium text-(--color-text) mb-3">
                Quick-fill from a role template
              </p>
              <div className="flex flex-wrap gap-2">
                {visibleRoles.map((template) => (
                  <button
                    key={template.role}
                    type="button"
                    onClick={() => handleRoleSelect(template)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedRole === template.role
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                    }`}
                  >
                    {template.role}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowAllRoles((v) => !v)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all flex items-center gap-1"
                >
                  {showAllRoles ? "Show less" : `+${jobTemplates.length - 6} more`}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${showAllRoles ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-(--color-text)">
                  Job Description
                  {selectedRole && (
                    <span className="ml-2 text-xs font-normal text-indigo-500">
                      ({selectedRole} template applied)
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-3">
                  {jobDescription && (
                    <button
                      type="button"
                      onClick={handleClearDescription}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                  <span className="text-xs text-(--color-muted)">
                    {jobDescription.length} chars
                  </span>
                </div>
              </div>
              <textarea
                rows="8"
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  if (selectedRole) setSelectedRole(null);
                }}
                placeholder="Paste the job description here, or pick a role template above..."
                className="w-full p-4 border border-(--color-border) rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-(--color-text) bg-gray-50 resize-none transition-all text-sm leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-(--color-primary) hover:bg-(--color-primary-dark) text-white rounded-xl text-base font-semibold transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Analyze Resume
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
