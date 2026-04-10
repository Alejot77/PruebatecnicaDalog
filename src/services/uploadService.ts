import type { ReportApi, UploadOptions } from "./api/reportApi";

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const uploadService: Pick<ReportApi, "uploadReport"> = {
  async uploadReport(file: File, options?: UploadOptions) {
    await wait(2000);

    const shouldFail = options?.shouldFail ?? false;
    if (shouldFail) {
      throw new Error("Upload failed. Please try again.");
    }

    return { fileName: file.name };
  },
};
