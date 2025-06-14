export interface MoviesSearchParams {
  query: string;
  genres: string[];
  yearFrom: number | null;
  yearTo: number | null;
  page: number;
}
