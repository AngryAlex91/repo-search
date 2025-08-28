import type { SearchFilters, SearchResponse } from "../types"

export const getPosts = async (
  filters: SearchFilters, 
  token: string, 
  searchQuery: string, 
  signal: AbortSignal
): Promise<SearchResponse> => {
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
  
  const response = await fetch(url.toString(), { headers, signal })
  
  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    
    try {
      const errorData = await response.json()
      if (errorData?.message) {
        message = errorData.message
      }
    } catch {
      // Keep default message if JSON parsing fails
    }
    
    if (response.status === 403 && message.toLowerCase().includes("rate limit")) {
      message += "\n\nTip: Add a GitHub personal access token to increase your rate limits."
    }
    
    throw new Error(message)
  }
  
  return response.json()
}