import type { Report } from "../../types/report";

export interface UploadOptions {
  shouldFail?: boolean;
}

export interface UploadResult {
  fileName: string;
}

export interface ReportApi {
  getReports: () => Promise<Report[]>;
  uploadReport: (file: File, options?: UploadOptions) => Promise<UploadResult>;
}
