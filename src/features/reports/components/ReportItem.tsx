import { memo } from "react";
import type { Report } from "../../../types/report";

interface ReportItemProps {
  report: Report;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function ReportItemComponent({ report }: ReportItemProps) {
  return (
    <li className="report-item">
      <div>
        <p className="report-item__title">{report.patientName}</p>
        <p className="report-item__meta">{report.testType}</p>
      </div>
      <div className="report-item__details">
        <span className="status-badge">{report.status}</span>
        <time dateTime={report.createdAt}>
          {dateFormatter.format(new Date(report.createdAt))}
        </time>
      </div>
    </li>
  );
}

export const ReportItem = memo(ReportItemComponent);
