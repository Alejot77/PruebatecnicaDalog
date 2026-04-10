import { useMemo } from "react";
import type { Report } from "../../../types/report";

export function useFilteredReports(reports: Report[], searchQuery: string) {
  return useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return reports;
    }

    return reports.filter((report) =>
      report.reportName.toLowerCase().includes(query),
    );
  }, [reports, searchQuery]);
}
