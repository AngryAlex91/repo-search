import { useEffect, useRef, useState } from "react";
import type { Repo, SearchResponse, SearchFilters } from "../types";
import { useDebounced } from "../hooks/useDebounce";
import { Pagination } from "../components/Pagination";
import { SearchForm } from "../components/SearchForm";
import { SearchResults } from "../components/SearchResults";
import { AdvancedSettings } from "../components/AdvancedSettings";
import { getPosts } from "../api/getPosts";



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

  const handleSearch = async () => {
    if (!searchQuery) return

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null) 

    try {
      const data: SearchResponse = await getPosts(filters, token, searchQuery, controller.signal)
          setRepos(data.items)
          setTotal(data.total_count)
          setError(null)
    } catch(err) {
       if (err instanceof Error) {
          if (err.name !== "AbortError") {
            setError(err.message || "An unexpected error occurred")
            setRepos(null)
            setTotal(0)
         
          }
          } else {
            setError("An unexpected error occurred")
          }
    } finally {
      setLoading(false)
    }
    

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
    <>
      <SearchForm
        filters={filters}
        onFiltersChange={updateFilters}
        onSearch={handleSearch}
        onClear={handleClear}
        loading={loading}
      />
      
      <AdvancedSettings
        token={token}
        onTokenChange={setToken}
      />
     
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
    </>
  );
}