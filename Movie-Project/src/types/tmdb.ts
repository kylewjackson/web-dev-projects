export interface MovieApiResponse {
  page: number;
  results: MovieApiResult[];
  total_pages: number;
  total_results: number;
}

export interface MovieApiResult {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
}
