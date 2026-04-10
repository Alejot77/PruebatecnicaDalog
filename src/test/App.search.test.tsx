import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { reportService } from "../services/reportService";
import { useReportStore } from "../state/reportStore";
import { useUploadStore } from "../state/uploadStore";
import type { Report } from "../types/report";

const MOCK_REPORTS: Report[] = [
  {
    id: "rep-001",
    patientName: "John Carter",
    testType: "Blood Test",
    createdAt: "2026-04-09T10:00:00.000Z",
    status: "ready",
  },
  {
    id: "rep-002",
    patientName: "Maria Lopez",
    testType: "MRI",
    createdAt: "2026-04-09T13:30:00.000Z",
    status: "reviewing",
  },
];

describe("Report search", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
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
    vi.spyOn(reportService, "getReports").mockResolvedValue(MOCK_REPORTS);
  });

  it("filters report list when typing in search input", async () => {
    render(<App />);

    await screen.findByText("John Carter");
    expect(screen.getByText("Maria Lopez")).toBeInTheDocument();

    const searchInput = screen.getByRole("searchbox", { name: /search reports/i });
    await userEvent.type(searchInput, "maria");

    await waitFor(() => {
      expect(screen.getByText("Maria Lopez")).toBeInTheDocument();
      expect(screen.queryByText("John Carter")).not.toBeInTheDocument();
    });
  });
});
