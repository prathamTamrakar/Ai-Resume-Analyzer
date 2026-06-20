import { useEffect, useState } from "react";
import {
  CheckCircle, AlertCircle, Lightbulb, Calendar, Tag, XCircle,
  FileText, Printer, Trash2, Upload, TrendingUp, Award, BarChart2,
  ChevronDown, ChevronUp, AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ScoreRing from "../components/ScoreRing";
import { useToast } from "../components/Toast";

/* ── Skeleton ── */
function SkeletonCard() {
  return (
    <div className="bg-white shadow-(--shadow-card) rounded-2xl overflow-hidden max-w-3xl w-full mb-6">
      <div className="bg-gray-50 border-b border-gray-100 p-8 flex flex-col items-center gap-4">
        <div className="skeleton w-24 h-4 rounded" />
        <div className="skeleton w-[120px] h-[120px] rounded-full" />
        <div className="skeleton w-20 h-4 rounded" />
      </div>
      <div className="p-8 space-y-6">
        {[0, 1, 2].map((s) => (
          <div key={s} className="space-y-2">
            <div className="skeleton w-28 h-4 rounded" />
            <div className="skeleton w-full h-3 rounded" />
            <div className="skeleton w-5/6 h-3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Score label ── */
function ScoreLabel({ score }) {
  if (score >= 85) return <span className="font-semibold text-emerald-600">Excellent Match</span>;
  if (score >= 70) return <span className="font-semibold text-blue-600">Good Match</span>;
  if (score >= 50) return <span className="font-semibold text-amber-600">Moderate Match</span>;
  return <span className="font-semibold text-red-600">Poor Match</span>;
}

/* ── Bullet section ── */
function Section({ icon: Icon, color, title, items }) {
  if (!items?.length) return null;
  const dotColor = color.includes("emerald")
    ? "bg-emerald-500"
    : color.includes("red")
    ? "bg-red-400"
    : "bg-amber-400";
  return (
    <section>
      <h3 className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3 ${color}`}>
        <Icon className="w-4 h-4" />
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((point, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-(--color-text) leading-relaxed">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Keyword chips ── */
function KeywordsSection({ keywords }) {
  if (!keywords) return null;
  const matched = keywords.matched || [];
  const missing = keywords.missing || [];
  if (!matched.length && !missing.length) return null;
  return (
    <section>
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3 text-indigo-600">
        <Tag className="w-4 h-4" />
        Keyword Analysis
      </h3>
      {matched.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-emerald-600 font-medium mb-2">Matched ({matched.length})</p>
          <div className="flex flex-wrap gap-2">
            {matched.map((kw, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-3 h-3" />{kw}
              </span>
            ))}
          </div>
        </div>
      )}
      {missing.length > 0 && (
        <div>
          <p className="text-xs text-red-500 font-medium mb-2">Missing ({missing.length})</p>
          <div className="flex flex-wrap gap-2">
            {missing.map((kw, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                <XCircle className="w-3 h-3" />{kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ── Stats bar ── */
function StatsBar({ reviews }) {
  const scores = reviews.map((r) => r.analysis?.score ?? 0);
  const best = Math.max(...scores);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const trend = scores.length >= 2 ? scores[0] - scores[1] : null;

  return (
    <div className="grid grid-cols-3 gap-4 max-w-3xl w-full mb-8 print:hidden">
      <div className="bg-white rounded-2xl p-5 text-center shadow-(--shadow-card)">
        <div className="flex items-center justify-center gap-2 mb-1">
          <BarChart2 className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">Total</span>
        </div>
        <p className="text-3xl font-extrabold text-indigo-600">{reviews.length}</p>
        <p className="text-xs text-(--color-muted) mt-0.5">Analyses</p>
      </div>

      <div className="bg-white rounded-2xl p-5 text-center shadow-(--shadow-card)">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Award className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">Best</span>
        </div>
        <p className="text-3xl font-extrabold text-emerald-600">{best}</p>
        <p className="text-xs text-(--color-muted) mt-0.5">Score</p>
      </div>

      <div className="bg-white rounded-2xl p-5 text-center shadow-(--shadow-card)">
        <div className="flex items-center justify-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-violet-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
            {trend !== null ? "Trend" : "Avg"}
          </span>
        </div>
        {trend !== null ? (
          <p className={`text-3xl font-extrabold ${trend > 0 ? "text-emerald-600" : trend < 0 ? "text-red-500" : "text-gray-500"}`}>
            {trend > 0 ? `+${trend}` : trend === 0 ? "=" : trend}
          </p>
        ) : (
          <p className="text-3xl font-extrabold text-violet-600">{avg}</p>
        )}
        <p className="text-xs text-(--color-muted) mt-0.5">
          {trend !== null ? "vs last" : "Score"}
        </p>
      </div>
    </div>
  );
}

/* ── Delete confirm inline ── */
function DeleteButton({ onConfirm }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-xs">
        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
        <span className="text-red-600 font-medium">Delete?</span>
        <button
          onClick={onConfirm}
          className="px-2 py-0.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </span>
    );
  }
  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors print:hidden"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Delete
    </button>
  );
}

/* ── Main page ── */
export default function ResumeReview() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [printId, setPrintId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      showError("Please login first");
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/resume/latest`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        if (!data || data.length === 0) {
          showError("No resume reviews found");
          navigate("/upload");
          return;
        }
        setReviews(data);
        setLoading(false);
      })
      .catch(() => {
        showError("Failed to load resume reviews");
        navigate("/upload");
      });
  }, [navigate, showError, token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/resume/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = reviews.filter((r) => r._id !== id);
      showSuccess("Analysis deleted");
      if (updated.length === 0) {
        navigate("/upload");
      } else {
        setReviews(updated);
      }
    } catch {
      showError("Failed to delete");
    }
  };

  const handlePrint = (id) => {
    setPrintId(id);
    setTimeout(() => {
      window.print();
      setPrintId(null);
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-(--color-bg) p-6 flex flex-col items-center pt-10">
        <div className="skeleton w-72 h-8 rounded-xl mb-8" />
        <SkeletonCard />
      </div>
    );
  }

  const displayed = showAll ? reviews : reviews.slice(0, 1);

  return (
    <div className="min-h-screen bg-(--color-bg) p-6 flex flex-col items-center pt-10">
      {/* Header */}
      <div className="max-w-3xl w-full flex items-center justify-between mb-6 print:hidden">
        <h2 className="text-3xl font-bold text-(--color-text)">Your Resume Analysis</h2>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Analyze Again
        </Link>
      </div>

      {/* Stats */}
      <StatsBar reviews={reviews} />

      {/* Cards */}
      {displayed.map((item, idx) => {
        const isPrintTarget = printId === item._id || (printId === null && false);
        return (
          <div
            key={item._id}
            className={`bg-white shadow-(--shadow-card) rounded-2xl overflow-hidden max-w-3xl w-full mb-6 animate-fade-in-up ${
              printId && printId !== item._id ? "print:hidden" : ""
            }`}
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            {/* Score Header */}
            <div className="bg-linear-to-r from-indigo-50 to-violet-50 border-b border-indigo-100 p-8 flex flex-col items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-(--color-muted)">
                AI Resume Score
              </p>
              <ScoreRing score={item.analysis.score} size={130} strokeWidth={10} />
              <div className="text-center">
                <ScoreLabel score={item.analysis.score} />
                <p className="text-xs text-(--color-muted) mt-0.5">
                  Scored {item.analysis.score} out of 100
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 space-y-7">
              {item.analysis.summary && (
                <section className="bg-indigo-50 rounded-xl p-4 text-sm text-indigo-900 leading-relaxed border border-indigo-100">
                  {item.analysis.summary}
                </section>
              )}

              <Section icon={CheckCircle} color="text-emerald-700" title="Strengths" items={item.analysis.strengths} />
              <Section icon={AlertCircle} color="text-red-600" title="Improvements Needed" items={item.analysis.improvements} />
              <Section icon={Lightbulb} color="text-amber-600" title="Suggestions" items={item.analysis.suggestions} />
              <KeywordsSection keywords={item.analysis.keywords} />

              {/* Footer row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-xs text-(--color-muted)">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.createdAt).toLocaleString()}
                </div>

                <div className="flex items-center gap-4">
                  {item.resumeFile && (
                    <a
                      href={`${import.meta.env.VITE_API_URL}/uploads/${item.resumeFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {item.originalFileName ?? "View Resume"}
                    </a>
                  )}

                  <button
                    onClick={() => handlePrint(item._id)}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition-colors print:hidden"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / Save PDF
                  </button>

                  <DeleteButton onConfirm={() => handleDelete(item._id)} />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Show all / show less toggle */}
      {reviews.length > 1 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-2 mb-8 inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-indigo-300 text-gray-600 hover:text-indigo-600 rounded-xl text-sm font-medium transition-all shadow-sm print:hidden"
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Latest Only
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show All History ({reviews.length} analyses)
            </>
          )}
        </button>
      )}
    </div>
  );
}
