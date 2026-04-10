import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useReportStore } from "../../../state/reportStore";
import { useUploadStore } from "../../../state/uploadStore";
import { shallow } from "zustand/shallow";
import type { Report } from "../../../types/report";

const ALLOWED_TYPES = new Set(["application/pdf", "text/csv"]);
const ALLOWED_EXTENSIONS = [".pdf", ".csv"];

function UploadAreaComponent() {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const addReport = useReportStore((state) => state.addReport);
  const {
    uploadStatus,
    uploadMessage,
    uploadReport,
    setUploadError,
    resetUploadStatus,
  } = useUploadStore(
      (state) => ({
        uploadStatus: state.uploadStatus,
        uploadMessage: state.uploadMessage,
        uploadReport: state.uploadReport,
        setUploadError: state.setUploadError,
        resetUploadStatus: state.resetUploadStatus,
      }),
      shallow,
    );

  const validateFile = useCallback((file: File) => {
    if (ALLOWED_TYPES.has(file.type)) return true;
    const fileName = file.name.toLowerCase();
    return ALLOWED_EXTENSIONS.some((extension) => fileName.endsWith(extension));
  }, []);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      if (!validateFile(file)) {
        setUploadError("Invalid file type. Please upload a PDF or CSV file.");
        return;
      }
      const result = await uploadReport(file);
      if (!result) return;

      const fileNameWithoutExt = result.fileName.replace(/\.[^/.]+$/, "");
      const newReport: Report = {
        id: `rep-${Date.now()}`,
        patientName: fileNameWithoutExt || "Uploaded Report",
        testType: "Uploaded file",
        createdAt: new Date().toISOString(),
        status: "reviewing",
      };
      addReport(newReport);
    },
    [addReport, setUploadError, uploadReport, validateFile],
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      setIsDragActive(false);
      void handleFile(event.dataTransfer.files?.[0] ?? null);
    },
    [handleFile],
  );

  const handleDropzoneClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      void handleFile(event.target.files?.[0] ?? null);
    },
    [handleFile],
  );

  const liveMessage = useMemo(() => {
    if (uploadStatus === "loading") return "Uploading file.";
    if (uploadStatus === "success") return uploadMessage ?? "Upload successful.";
    if (uploadStatus === "error") return uploadMessage ?? "Upload failed.";
    return "";
  }, [uploadMessage, uploadStatus]);

  return (
    <section
      className={`upload-area ${isDragActive ? "upload-area--active" : ""}`}
      aria-labelledby="upload-title"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
    >
      <h2 id="upload-title">Upload report</h2>
      <p>Drag and drop a file here, or select one manually.</p>

      <div
        className="upload-area__dropzone"
        aria-hidden="true"
      >
        Drop file here or use the button to select
      </div>

      <button
        type="button"
        className="upload-area__button"
        onClick={handleDropzoneClick}
        aria-describedby="upload-help"
      >
        Select file
      </button>

      <input
        ref={fileInputRef}
        className="sr-only"
        type="file"
        aria-label="Upload report file"
        accept=".pdf,.csv,application/pdf,text/csv"
        aria-describedby="upload-help"
        onChange={handleInputChange}
      />
      <p id="upload-help" className="upload-help">
        Supported files: PDF and CSV. You can drag and drop, click, or tab to the button.
      </p>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>

      {uploadStatus === "loading" ? (
        <p className="upload-message" role="status" aria-live="polite">
          <span className="upload-spinner" aria-hidden="true" />
          Uploading...
        </p>
      ) : null}

      {uploadStatus === "success" ? (
        <p className="upload-message upload-message--success" role="status" aria-live="polite">
          Upload successful. {uploadMessage}
        </p>
      ) : null}

      {uploadStatus === "error" ? (
        <div className="upload-message upload-message--error" role="alert">
          <p>Upload failed. {uploadMessage}</p>
          <button type="button" onClick={resetUploadStatus}>
            Dismiss
          </button>
        </div>
      ) : null}
    </section>
  );
}

export const UploadArea = memo(UploadAreaComponent);
