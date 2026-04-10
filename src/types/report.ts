export type ReportStatus = "ready" | "reviewing" | "failed";

export interface Report {
  id: string;
  patientName: string;
  testType: string;
  createdAt: string;
  status: ReportStatus;
}
