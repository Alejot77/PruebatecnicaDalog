import { memo } from "react";
import type { Report } from "../../../types/report";
import { ReportItem } from "./ReportItem";

interface ReportListProps {
  reports: Report[];
  isLoading: boolean;
}

function ReportListComponent({ reports, isLoading }: ReportListProps) {
  if (isLoading) {
    return (
      <p className="panel-message" role="status" aria-live="polite">
        Loading reports...
      </p>
    );
  }

  if (reports.length === 0) {
    return (
      <p className="panel-message" role="status" aria-live="polite">
        No reports found.
      </p>
    );
  }

  return (
    <ul id="report-list" className="report-list" aria-label="Diagnostic reports">
      {reports.map((report) => (
        <ReportItem key={report.id} report={report} />
      ))}
    </ul>
  );
}

export const ReportList = memo(ReportListComponent);
