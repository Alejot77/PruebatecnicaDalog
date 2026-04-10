import type { Report } from "../types/report";
import type { ReportApi } from "./api/reportApi";

const MOCK_REPORTS: Report[] = [
  {
    id: "rep-001",
    patientName: "John Carter",
    testType: "Blood Test",
    createdAt: "2026-04-09T10:00:00.000Z",
    status: "ready",
  },
  {
    id: "rep-002",
    patientName: "Maria Lopez",
    testType: "MRI",
    createdAt: "2026-04-09T13:30:00.000Z",
    status: "reviewing",
  },
  {
    id: "rep-003",
    patientName: "Alex Kim",
    testType: "X-Ray",
    createdAt: "2026-04-10T08:15:00.000Z",
    status: "failed",
  },
];

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const reportService: Pick<ReportApi, "getReports"> = {
  async getReports() {
    await delay(350);
    return MOCK_REPORTS;
  },
};
