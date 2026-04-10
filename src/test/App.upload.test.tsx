import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { reportService } from "../services/reportService";
import { uploadService } from "../services/uploadService";
import { useReportStore } from "../state/reportStore";
import { useUploadStore } from "../state/uploadStore";
import { REPORTS_STORAGE_KEY } from "../utils/reportStorage";

describe("Upload flow", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    localStorage.removeItem(REPORTS_STORAGE_KEY);
    useReportStore.setState({
      reports: [],
      searchQuery: "",
      isLoading: false,
      error: null,
    });
    useUploadStore.setState({
      uploadStatus: "idle",
      uploadMessage: null,
    });
    vi.spyOn(reportService, "getReports").mockResolvedValue([]);
  });

  it("shows loading and success states, then adds report to list", async () => {
    let resolveUpload: ((value: { fileName: string }) => void) | undefined;
    vi.spyOn(uploadService, "uploadReport").mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpload = resolve;
        }),
    );

    render(<App />);

    const input = await screen.findByLabelText("Upload report file");
    const file = new File(["pdf-content"], "lab-results.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Uploading...")).toBeInTheDocument();
    });

    resolveUpload?.({ fileName: "lab-results.pdf" });

    await waitFor(() => {
      expect(screen.getByText(/Upload successful\./i)).toBeInTheDocument();
      expect(screen.getByText("lab-results.pdf")).toBeInTheDocument();
    });
  });

  it("shows error message when upload fails using shouldFail=true", async () => {
    vi.useFakeTimers();
    render(<App />);

    const file = new File(["csv-content"], "bad.csv", {
      type: "text/csv",
    });

    const uploadPromise = useUploadStore
      .getState()
      .uploadReport(file, { shouldFail: true });
    await vi.advanceTimersByTimeAsync(2000);
    await uploadPromise;

    await waitFor(() => {
      expect(screen.getByText(/Upload failed\./i)).toBeInTheDocument();
    });
  });
});
