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
  const estimatedSize = `${(report.id.length * 42).toFixed(0)} KB`;

  return (
    <li className="report-item">
      <div className="report-item__main">
        <p className="report-item__title">{report.patientName}</p>
        <div className="report-item__meta-grid">
          <p className="report-item__meta">
            <span>Type:</span> {report.testType}
          </p>
          <p className="report-item__meta">
            <span>Size:</span> {estimatedSize}
          </p>
        </div>
      </div>
      <div className="report-item__details">
        <span className="status-badge">{report.status}</span>
        <time dateTime={report.createdAt} className="report-item__date">
          {dateFormatter.format(new Date(report.createdAt))}
        </time>
      </div>
    </li>
  );
}

export const ReportItem = memo(ReportItemComponent);
