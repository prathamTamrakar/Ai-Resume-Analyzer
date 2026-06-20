import { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { useToast } from "../components/Toast";

function validateFile(file, accept) {
  const acceptList = accept.split(",").map((s) => s.trim().toLowerCase());
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  return acceptList.some((entry) => {
    if (entry.startsWith(".")) {
      return fileName.endsWith(entry);
    }
    // MIME type match (e.g. "application/pdf" or "application/*")
    if (entry.includes("/")) {
      if (entry.endsWith("/*")) {
        return mimeType.startsWith(entry.slice(0, -1));
      }
      return mimeType === entry;
    }
    return false;
  });
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileDropZone({ file, onFileChange, accept = ".pdf,.doc,.docx" }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const { showError } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;
    if (validateFile(dropped, accept)) {
      onFileChange(dropped);
    } else {
      showError("Unsupported file type");
    }
  };

  const handleInputChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (validateFile(selected, accept)) {
      onFileChange(selected);
    } else {
      showError("Unsupported file type");
    }
    // Reset input so the same file can be re-selected after clearing
    e.target.value = "";
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onFileChange(null);
  };

  // Determine visual state
  const isFilled = !!file;

  const zoneClasses = [
    "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-8 cursor-pointer transition-all duration-200 select-none",
    isFilled
      ? "border-green-400 border-solid bg-green-50"
      : isDragging
      ? "border-indigo-500 border-solid bg-indigo-50"
      : "border-gray-300 border-dashed bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/40",
  ].join(" ");

  const iconColor = isFilled
    ? "text-green-600"
    : isDragging
    ? "text-indigo-600"
    : "text-indigo-400";

  return (
    <div
      className={zoneClasses}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="File drop zone. Click or drag a file here to upload."
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {isFilled ? (
        <>
          <FileText className={`w-10 h-10 ${iconColor}`} />
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-800 break-all">{file.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{formatSize(file.size)}</p>
          </div>
          {/* Clear button */}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Remove selected file"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <UploadCloud className={`w-10 h-10 ${iconColor}`} />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {isDragging ? "Drop your file here" : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Accepted: {accept}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
