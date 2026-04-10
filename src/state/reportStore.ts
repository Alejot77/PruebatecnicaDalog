import { create } from "zustand";
import { reportService } from "../services/reportService";
import type { Report } from "../types/report";

interface ReportState {
  reports: Report[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (value: string) => void;
  addReport: (report: Report) => void;
  loadReports: () => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  searchQuery: "",
  isLoading: false,
  error: null,
  setSearchQuery: (value) => set({ searchQuery: value }),
  addReport: (report) =>
    set((state) => ({
      reports: [report, ...state.reports],
    })),
  loadReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const reports = await reportService.getReports();
      set({ reports, isLoading: false });
    } catch {
      set({
        error: "Could not load reports.",
        isLoading: false,
      });
    }
  },
}));
