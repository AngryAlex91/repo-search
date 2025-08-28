import type { SearchFilters } from "../types";

export const SearchForm: React.FC<{
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onSearch: () => void;
  onClear: () => void;
  loading: boolean;
}> = ({ filters, onFiltersChange, onSearch, onClear, loading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-row">
          <div className="field field-primary">
            <label htmlFor="search-query">What are you looking for?</label>
            <input
              id="search-query"
              type="text"
              placeholder="Try 'react hooks' or 'machine learning python'"
              value={filters.query}
              onChange={(e) => onFiltersChange({ query: e.target.value })}
              autoFocus
            />
          </div>
          
          <div className="field">
            <label htmlFor="language">Programming Language</label>
            <input
              id="language"
              type="text"
              placeholder="e.g., JavaScript, Python"
              value={filters.language}
              onChange={(e) => onFiltersChange({ language: e.target.value })}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="field">
            <label htmlFor="sort">Sort by</label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => onFiltersChange({ sort: e.target.value as any })}
            >
              <option value="best">Most relevant</option>
              <option value="stars">Most stars</option>
              <option value="forks">Most forks</option>
              <option value="updated">Recently updated</option>
            </select>
          </div>
          
          <div className="field">
            <label htmlFor="order">Order</label>
            <select
              id="order"
              value={filters.order}
              onChange={(e) => onFiltersChange({ order: e.target.value as any })}
            >
              <option value="desc">High to low</option>
              <option value="asc">Low to high</option>
            </select>
          </div>
          
          <div className="field">
            <label htmlFor="per-page">Results per page</label>
            <select
              id="per-page"
              value={filters.perPage}
              onChange={(e) => onFiltersChange({ perPage: parseInt(e.target.value) })}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          {/* <button type="submit" disabled={loading || !filters.query.trim()} onClick={handleSubmit}>
            {loading ? "Searching..." : "Search Repositories"}
          </button> */}
          <button type="button" onClick={onClear} disabled={loading}>
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
};