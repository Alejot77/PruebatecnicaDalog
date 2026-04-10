import type { Report } from "../types/report";

export const REPORTS_STORAGE_KEY = "dalog-diagnostic-reports";

export function loadReportsFromStorage(): Report[] | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed as Report[];
  } catch {
    return null;
  }
}

export function saveReportsToStorage(reports: Report[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
}
