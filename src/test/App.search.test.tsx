import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { reportService } from "../services/reportService";
import { useReportStore } from "../state/reportStore";
import { useUploadStore } from "../state/uploadStore";
import type { Report } from "../types/report";
import { REPORTS_STORAGE_KEY } from "../utils/reportStorage";

const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    patientName: "vibration_analysis_01.pdf",
    testType: "Vibration",
    createdAt: "2023-10-01",
    status: "success",
    fileSize: "2.4MB",
  },
  {
    id: "2",
    patientName: "motor_thermal_B.csv",
    testType: "Thermal",
    createdAt: "2023-10-02",
    status: "success",
    fileSize: "1.1MB",
  },
];

describe("Report search", () => {
  afterEach(() => {
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
    vi.spyOn(reportService, "getReports").mockResolvedValue(MOCK_REPORTS);
  });

  it("filters report list when typing in search input", async () => {
    render(<App />);

    await screen.findByText("vibration_analysis_01.pdf");
    expect(screen.getByText("motor_thermal_B.csv")).toBeInTheDocument();

    const searchInput = screen.getByRole("searchbox", { name: /search reports/i });
    await userEvent.type(searchInput, "motor");

    await waitFor(() => {
      expect(screen.getByText("motor_thermal_B.csv")).toBeInTheDocument();
      expect(
        screen.queryByText("vibration_analysis_01.pdf"),
      ).not.toBeInTheDocument();
    });
  });
});
