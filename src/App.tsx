import { Suspense, lazy, useCallback, useEffect, useMemo } from "react";
import { ReportList } from "./features/reports/components/ReportList";
import { SearchBar } from "./features/reports/components/SearchBar";
import { useFilteredReports } from "./features/reports/hooks/useFilteredReports";
import { useReportStore } from "./state/reportStore";
import { shallow } from "zustand/shallow";

const UploadArea = lazy(() =>
  import("./features/reports/components/UploadArea").then((module) => ({
    default: module.UploadArea,
  })),
);

function App() {
  const { reports, searchQuery, isLoading, error, setSearchQuery, loadReports } =
    useReportStore(
      (state) => ({
        reports: state.reports,
        searchQuery: state.searchQuery,
        isLoading: state.isLoading,
        error: state.error,
        setSearchQuery: state.setSearchQuery,
        loadReports: state.loadReports,
      }),
      shallow,
    );

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const filteredReports = useFilteredReports(reports, searchQuery);
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
    },
    [setSearchQuery],
  );
  const resultsMessage = useMemo(
    () =>
      isLoading
        ? "Loading reports."
        : `${filteredReports.length} report${filteredReports.length === 1 ? "" : "s"} found.`,
    [filteredReports.length, isLoading],
  );

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Diagnostic Report Manager</h1>
        <p>Base architecture ready for upload flow and accessibility enhancements.</p>
      </header>

      <section className="panel" aria-labelledby="reports-title">
        <h2 id="reports-title" className="section-title">
          Reports
        </h2>
        <SearchBar value={searchQuery} onChange={handleSearchChange} />
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {resultsMessage}
        </p>
        {error ? <p className="panel-error">{error}</p> : null}
        <ReportList reports={filteredReports} isLoading={isLoading} />
      </section>

      <Suspense fallback={<p className="panel-message">Loading upload area...</p>}>
        <UploadArea />
      </Suspense>
    </main>
  );
}

export default App;
