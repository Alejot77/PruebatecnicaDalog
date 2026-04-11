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
        <div className="app-header__row">
          <div className="app-header__titles">
            <h1>Diagnostic Report Manager</h1>
            <p>Base architecture ready for upload flow and accessibility enhancements.</p>
          </div>
          <div className="app-header__logo" aria-hidden="true">
            <svg
              className="app-header__logo-svg"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="6"
                width="32"
                height="38"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 14h16M12 22h10M12 30h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="38" cy="14" r="8" fill="currentColor" opacity="0.15" />
              <path
                d="M34 18l3-3 4 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
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
