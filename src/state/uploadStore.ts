import { create } from "zustand";
import type { UploadOptions, UploadResult } from "../services/api/reportApi";
import { uploadService } from "../services/uploadService";

export type UploadStatus = "idle" | "loading" | "success" | "error";

interface UploadState {
  uploadStatus: UploadStatus;
  uploadMessage: string | null;
  uploadReport: (
    file: File,
    options?: UploadOptions,
  ) => Promise<UploadResult | null>;
  setUploadError: (message: string) => void;
  resetUploadStatus: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploadStatus: "idle",
  uploadMessage: null,
  uploadReport: async (file, options) => {
    set({ uploadStatus: "loading", uploadMessage: null });
    try {
      const result = await uploadService.uploadReport(file, options);
      set({
        uploadStatus: "success",
        uploadMessage: `${result.fileName} uploaded successfully.`,
      });
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Upload failed. Please try again.";
      set({ uploadStatus: "error", uploadMessage: message });
      return null;
    }
  },
  setUploadError: (message) => set({ uploadStatus: "error", uploadMessage: message }),
  resetUploadStatus: () => set({ uploadStatus: "idle", uploadMessage: null }),
}));
