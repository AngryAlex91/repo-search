import type { Repo } from "../types";
import { RepoCard } from "./RepoCard";

export const SearchResults: React.FC<{
  repos: Repo[] | null;
  total: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}> = ({ repos, total, loading, error, searchQuery }) => {
  if (!searchQuery) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h2>Discover amazing GitHub repositories</h2>
        <p>
          Search for projects by name, description, or topics. Try searching for{" "}
          <code>"react typescript"</code>, <code>"machine learning"</code>, or{" "}
          <code>"web scraping python"</code>.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Searching GitHub repositories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h2>Something went wrong</h2>
        <p className="error-message">{error}</p>
        <p className="error-hint">
          {error.includes("rate limit") && 
            "You've hit GitHub's rate limit. Try adding a personal access token in the advanced settings to get higher limits."
          }
        </p>
      </div>
    );
  }

  if (repos && repos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🤷‍♂️</div>
        <h2>No repositories found</h2>
        <p>
          Try adjusting your search terms or filters. You might want to:
        </p>
        <ul>
          <li>Use broader keywords</li>
          <li>Remove language filters</li>
          <li>Check for typos</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-summary">
        <strong>{total.toLocaleString()}</strong> repositories found
        {total > 1000 && (
          <span className="note"> (showing first 1,000 results)</span>
        )}
        <div className="search-query">
          Searching for: <code>{searchQuery}</code>
        </div>
      </div>
      
      <div className="repos-grid">
        {repos?.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};