import { mapReportDtoToReport } from "../mappers/reportMapper";
import type { Report } from "../types/report";
import type { ReportDTO } from "../types/reportDto";
import type { ReportApi } from "./api/reportApi";

const INITIAL_REPORT_DTOS: ReportDTO[] = [
  {
    id: 1,
    name: "vibration_analysis_01.pdf",
    size: "2.4MB",
    type: "Vibration",
    date: "2023-10-01",
  },
  {
    id: 2,
    name: "motor_thermal_B.csv",
    size: "1.1MB",
    type: "Thermal",
    date: "2023-10-02",
  },
];

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const reportService: Pick<ReportApi, "getReports"> = {
  async getReports(): Promise<Report[]> {
    await delay(350);
    return INITIAL_REPORT_DTOS.map(mapReportDtoToReport);
  },
};
