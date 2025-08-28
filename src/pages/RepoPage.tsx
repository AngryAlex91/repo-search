import { useEffect, useRef, useState } from "react";
import type { Repo, SearchResponse, SearchFilters } from "../types";
import { useDebounced } from "../hooks/useDebounce";
import { Pagination } from "../components/Pagination";
import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";



export const RepoPage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    language: "",
    sort: "best",
    order: "desc",
    page: 1,
    perPage: 20,
  })
  
  const [repos, setRepos] = useState<Repo[] | null>(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState("")
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const debouncedQuery = useDebounced(filters.query, 500)
  const debouncedLanguage = useDebounced(filters.language, 500)
  
  const searchQuery = debouncedQuery.trim() + 
    (debouncedLanguage.trim() ? ` language:${debouncedLanguage.trim()}` : "")

  const totalPages = !total ? 0 : 
    Math.min(Math.ceil(total / filters.perPage), Math.floor(1000 / filters.perPage))

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    if ('query' in newFilters || 'language' in newFilters) {
      setFilters(prev => ({ ...prev, page: 1 }))
    }
  };

  const handleSearch = () => {
    if (!searchQuery) return
    
    // Cancel any ongoing request
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller
    
    setLoading(true)
    setError(null)
    
    const url = new URL("https://api.github.com/search/repositories")
    url.searchParams.set("q", searchQuery)
    url.searchParams.set("per_page", filters.perPage.toString())
    url.searchParams.set("page", filters.page.toString())
    
    if (filters.sort !== "best") {
      url.searchParams.set("sort", filters.sort)
      url.searchParams.set("order", filters.order)
    }
    
    const headers: Record<string, string> = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    fetch(url.toString(), { headers, signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          let message = `${response.status} ${response.statusText}`
          try {
            const data = await response.json()
            if (data?.message) message = data.message;
          } catch {}
          
          if (response.status === 403 && message.toLowerCase().includes("rate limit")) {
            message += "\n\nTip: Add a GitHub personal access token to increase your rate limits."
          }
          
          throw new Error(message)
        }
        return response.json()
      })
      .then((data: SearchResponse) => {
        setRepos(data.items)
        setTotal(data.total_count)
        setError(null)
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message || "An unexpected error occurred")
          setRepos(null)
          setTotal(0)
        }
      })
      .finally(() => {
        setLoading(false)
      });
  };

  const handleClear = () => {
    setFilters({
      query: "",
      language: "",
      sort: "best",
      order: "desc",
      page: 1,
      perPage: 20,
    });
    setRepos(null)
    setTotal(0)
    setError(null)
  };

  // Search when query changes or page/sort options change
  useEffect(() => {
    if (searchQuery) {
      handleSearch()
    } else {
      setRepos(null)
      setTotal(0)
      setError(null)
    }
  }, [searchQuery, filters.page, filters.sort, filters.order, filters.perPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, [])

  return (
    <div className="app">
      
      <header className="app-header">
        <h1>GitHub Repository Search</h1>
        <p>Discover and explore open source projects</p>
      </header>
      
      <SearchForm
        filters={filters}
        onFiltersChange={updateFilters}
        onSearch={handleSearch}
        onClear={handleClear}
        loading={loading}
      />
      
      {/* Token Input */}
      <details className="token-section">
        <summary>⚙️ Advanced Settings</summary>
        <div className="token-input">
          <label htmlFor="github-token">
            GitHub Personal Access Token (optional)
          </label>
          <input
            id="github-token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <p className="token-help">
            Adding a token increases your rate limits from 60 to 5,000 requests per hour.
            <br />
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Create a token here
            </a> (no scopes needed for public repositories).
          </p>
        </div>
      </details>
      
      <main>
        <SearchResults
          repos={repos}
          total={total}
          loading={loading}
          error={error}
          searchQuery={searchQuery}
        />
        
        <Pagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={(page) => updateFilters({ page })}
        />
      </main>
      
      <footer className="app-footer">
        <p>
          Powered by the{" "}
          <a 
            href="https://docs.github.com/en/rest/search"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Search API
          </a>
          . Rate limits apply for unauthenticated requests.
        </p>
      </footer>
    </div>
  );
}
