import { useEffect, useState } from "react";
import { FileText, TrendingUp, AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResumeReview() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first ❌");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/resume/latest", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("No resume review found, upload resume first!");
        navigate("/upload");
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading review results...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl w-full">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Resume Review Results
        </h2>

        {/* Score */}
        <div className="flex items-center justify-center gap-4 bg-blue-50 p-6 rounded-xl mb-8">
          <TrendingUp className="w-12 h-12 text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Overall Score</p>
            <h3 className="text-4xl font-bold text-blue-700">
              {data.analysis.score}%
            </h3>
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" /> Strengths
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {data.analysis.strengths.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" /> Improvements Needed
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {data.analysis.improvements.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
