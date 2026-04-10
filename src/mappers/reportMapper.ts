import type { Report } from "../types/report";
import type { ReportDTO } from "../types/reportDto";

export function mapReportDtoToReport(dto: ReportDTO): Report {
  return {
    id: String(dto.id),
    reportName: dto.name,
    testType: dto.type,
    createdAt: dto.date,
    status: "success",
    fileSize: dto.size,
  };
}
