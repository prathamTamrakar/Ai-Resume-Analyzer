import { Link } from "react-router-dom";
import { FileSearch, Upload, LogIn, ArrowRight, Zap, Star, CheckCircle } from "lucide-react";

const STEPS = [
  { number: "01", title: "Upload Resume", desc: "Drop your PDF or DOCX resume — takes seconds." },
  { number: "02", title: "AI Analysis", desc: "Our AI engine reads, scores, and evaluates your resume." },
  { number: "03", title: "Get Results", desc: "Receive a score, strengths, and improvement tips." },
];

const FEATURES = [
  {
    icon: Upload,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    to: "/upload",
    title: "Upload Resume",
    desc: "Upload PDF or DOCX and get ready to analyze.",
  },
  {
    icon: FileSearch,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    to: "/results",
    title: "Review Results",
    desc: "Get score, strengths, weaknesses, and suggestions.",
  },
  {
    icon: LogIn,
    color: "text-violet-600",
    bg: "bg-violet-50",
    to: "/login",
    title: "Account Login",
    desc: "Login to track history and improvements over time.",
  },
];

const STATS = [
  { value: "10K+", label: "Resumes Analyzed" },
  { value: "95%", label: "Match Accuracy" },
  { value: "<30s", label: "Analysis Time" },
  { value: "Free", label: "To Get Started" },
];

const PERKS = [
  "Instant AI-powered score",
  "Detailed strengths & weaknesses",
  "Tailored improvement tips",
  "Job description matching",
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center text-center pt-20 pb-16 px-4 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-linear-to-b from-indigo-100/70 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Badge */}
        <div className="mb-5 inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-sm font-medium animate-fade-in">
          <Zap className="w-3.5 h-3.5" />
          Powered by AI
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold max-w-3xl leading-tight bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in-up">
          Land Your Dream Job with AI
        </h1>

        <p className="text-gray-500 mt-5 max-w-lg text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          Upload your resume, get an instant AI score, and receive actionable feedback to beat the competition.
        </p>

        {/* Perks row */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 animate-fade-in" style={{ animationDelay: "120ms" }}>
          {PERKS.map((perk) => (
            <span key={perk} className="flex items-center gap-1.5 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              {perk}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up" style={{ animationDelay: "160ms" }}>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl font-semibold text-base transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
          >
            Analyze My Resume
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-semibold text-base transition-all duration-200 shadow-sm hover:-translate-y-0.5"
          >
            Create Free Account
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-7 flex items-center gap-1.5 text-sm text-gray-400 animate-fade-in" style={{ animationDelay: "200ms" }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-1">Trusted by 10,000+ job seekers</span>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-5xl w-full mx-auto px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-5 text-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow duration-200"
            >
              <p className="text-3xl font-extrabold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {value}
              </p>
              <p className="text-sm text-[var(--color-muted)] mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-5xl w-full mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-center text-[var(--color-text)] mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map(({ number, title, desc }) => (
            <div key={number} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-200">
                {number}
              </div>
              <h3 className="font-semibold text-[var(--color-text)]">{title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl w-full mx-auto px-6 pb-14">
        <h2 className="text-2xl font-bold text-center text-[var(--color-text)] mb-8">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, color, bg, to, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="group p-7 bg-white shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] rounded-2xl text-center transition-all duration-200 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 ${bg} rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{desc}</p>
              <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${color}`}>
                Get started <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-5xl w-full mx-auto px-6 pb-14">
        <div className="bg-linear-to-r from-indigo-600 to-violet-600 rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to Improve Your Resume?</h2>
          <p className="text-indigo-100 mb-7 text-base">
            Get your AI resume score in under 30 seconds — completely free.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Upload Resume Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm border-t border-gray-100">
        © 2025 AI Resume Analyzer · Built with ❤️ for job seekers
      </footer>
    </div>
  );
}
