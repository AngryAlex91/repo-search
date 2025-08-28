export type Owner = {
  login: string;
  avatar_url: string;
  html_url: string;
}

export type Repo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: Owner;
  updated_at: string;
  open_issues_count: number;
}

export type SearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: Repo[];
};

export type SearchFilters = {
  query: string;
  language: string;
  sort: "best" | "stars" | "forks" | "updated";
  order: "desc" | "asc";
  page: number;
  perPage: number;
}