import { memo } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBarComponent({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="report-search">Search reports</label>
      <input
        id="report-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by patient or test type"
        aria-controls="report-list"
      />
    </div>
  );
}

export const SearchBar = memo(SearchBarComponent);
