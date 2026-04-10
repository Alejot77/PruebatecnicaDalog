import { useMemo } from "react";
import type { Report } from "../../../types/report";

export function useFilteredReports(reports: Report[], searchQuery: string) {
  return useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return reports;
    }

    return reports.filter((report) => {
      return (
        report.patientName.toLowerCase().includes(query) ||
        report.testType.toLowerCase().includes(query)
      );
    });
  }, [reports, searchQuery]);
}
