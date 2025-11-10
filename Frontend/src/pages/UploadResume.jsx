import { useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UploadResume() {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile || !jobDescription) {
      alert("Please upload resume and enter job description!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first ❌");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Resume uploaded successfully ✅");
      navigate("/review"); // go to review page
    } catch (error) {
      console.log(error);
      alert("Resume upload or AI processing failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Upload Your Resume
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Upload your resume and enter the job description you are applying for.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Upload Box */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">
              {resumeFile ? (
                <span className="font-medium text-gray-800">
                  {resumeFile.name}
                </span>
              ) : (
                "Drag & Drop or Click to Upload Resume"
              )}
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="cursor-pointer mt-3"
            />
          </div>

          {/* Job Description Input */}
          <div>
            <label className="text-gray-700 font-medium">Job Description</label>
            <textarea
              rows="6"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full mt-2 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-gray-50"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-medium"
          >
            Analyze Resume
          </button>
        </form>
      </div>
    </div>
  );
}
