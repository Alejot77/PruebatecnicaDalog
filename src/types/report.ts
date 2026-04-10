export type ReportStatus = "ready" | "reviewing" | "failed" | "success";

export interface Report {
  id: string;
  reportName: string;
  testType: string;
  createdAt: string;
  status: ReportStatus;
  /** Display size from source data or upload (e.g. "2.4MB"). */
  fileSize?: string;
}
