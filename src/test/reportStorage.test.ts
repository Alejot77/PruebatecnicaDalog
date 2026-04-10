import { beforeEach, describe, expect, it } from "vitest";
import type { Report } from "../types/report";
import {
  REPORTS_STORAGE_KEY,
  loadReportsFromStorage,
  saveReportsToStorage,
} from "../utils/reportStorage";

describe("reportStorage", () => {
  beforeEach(() => {
    localStorage.removeItem(REPORTS_STORAGE_KEY);
  });

  it("returns null for invalid JSON", () => {
    localStorage.setItem(REPORTS_STORAGE_KEY, "not-json");
    expect(loadReportsFromStorage()).toBeNull();
  });

  it("returns null when an entry is not a valid Report", () => {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify([{ id: "1" }]));
    expect(loadReportsFromStorage()).toBeNull();
  });

  it("round-trips valid reports", () => {
    const reports: Report[] = [
      {
        id: "1",
        reportName: "a.pdf",
        testType: "Thermal",
        createdAt: "2024-01-01",
        status: "success",
        fileSize: "1MB",
      },
    ];
    saveReportsToStorage(reports);
    expect(loadReportsFromStorage()).toEqual(reports);
  });
});
