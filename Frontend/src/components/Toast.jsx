import { createContext, useContext, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

const TYPE_CONFIG = {
  success: {
    border: "border-l-emerald-500",
    icon: CheckCircle,
    iconColor: "text-emerald-500",
  },
  error: {
    border: "border-l-red-500",
    icon: XCircle,
    iconColor: "text-red-500",
  },
  info: {
    border: "border-l-blue-500",
    icon: Info,
    iconColor: "text-blue-500",
  },
  warning: {
    border: "border-l-amber-500",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
};

function ToastItem({ toast, visible, onDismiss }) {
  const config = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-lg
        border-l-4 ${config.border}
        bg-white min-w-[300px] max-w-sm
        transition-all duration-300
        ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconColor}`} />
      <span className="text-sm font-medium text-gray-800 flex-1 leading-relaxed">
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gray-300 hover:text-gray-500 transition-colors ml-1 mt-0.5"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [visibleIds, setVisibleIds] = useState(new Set());

  const dismiss = useCallback((id) => {
    setVisibleIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    (message, type = "info") => {
      if (!message) return;
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      requestAnimationFrame(() => {
        setVisibleIds((prev) => new Set([...prev, id]));
      });
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  const showSuccess = useCallback((message) => showToast(message, "success"), [showToast]);
  const showError = useCallback((message) => showToast(message, "error"), [showToast]);

  const portal = ReactDOM.createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} visible={visibleIds.has(toast.id)} onDismiss={dismiss} />
        </div>
      ))}
    </div>,
    document.body
  );

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError }}>
      {children}
      {portal}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export default ToastProvider;
