import type { Report, ReportStatus } from "../types/report";

export const REPORTS_STORAGE_KEY = "dalog-diagnostic-reports";

const REPORT_STATUSES: ReportStatus[] = ["ready", "reviewing", "failed", "success"];

function isReportStatus(value: unknown): value is ReportStatus {
  return typeof value === "string" && REPORT_STATUSES.includes(value as ReportStatus);
}

function parseReportEntry(value: unknown): Report | null {
  if (value === null || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.reportName !== "string" ||
    typeof o.testType !== "string" ||
    typeof o.createdAt !== "string" ||
    !isReportStatus(o.status)
  ) {
    return null;
  }
  if (o.fileSize !== undefined && typeof o.fileSize !== "string") {
    return null;
  }
  const report: Report = {
    id: o.id,
    reportName: o.reportName,
    testType: o.testType,
    createdAt: o.createdAt,
    status: o.status,
  };
  if (typeof o.fileSize === "string") {
    report.fileSize = o.fileSize;
  }
  return report;
}

export function loadReportsFromStorage(): Report[] | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const reports: Report[] = [];
    for (const item of parsed) {
      const report = parseReportEntry(item);
      if (report === null) return null;
      reports.push(report);
    }
    return reports;
  } catch {
    return null;
  }
}

export function saveReportsToStorage(reports: Report[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
}
