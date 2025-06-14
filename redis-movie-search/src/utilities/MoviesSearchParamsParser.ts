import { MoviesSearchParams } from "./MoviesSearchParams";

enum QueryKey {
  QUERY = "q",
  GENRES = "g",
  YEAR_FROM = "f",
  YEAR_TO = "t",
  PAGE = "p",
}

export default class MoviesSearchParamsParser {
  static parse(query: URLSearchParams): MoviesSearchParams {
    return {
      query: query.get(QueryKey.QUERY) ?? "",
      genres: (query.get(QueryKey.GENRES) ?? "").split("_").filter(Boolean),
      yearFrom: query.has(QueryKey.YEAR_FROM)
        ? Math.max(0, Number.parseInt(query.get(QueryKey.YEAR_FROM)!) || 0)
        : null,
      yearTo: query.has(QueryKey.YEAR_TO)
        ? Math.max(0, Number.parseInt(query.get(QueryKey.YEAR_TO)!) || 0)
        : null,
      page: query.has(QueryKey.PAGE)
        ? Math.max(1, Number.parseInt(query.get(QueryKey.PAGE)!) || 1)
        : 1,
    };
  }

  static serialize(params: MoviesSearchParams): string {
    const query = new URLSearchParams();

    if (params.query.trim().length > 0) {
      query.append(QueryKey.QUERY, params.query);
    }

    if (params.genres.length > 0) {
      query.append(QueryKey.GENRES, params.genres.join("_"));
    }

    if (Number.isFinite(params.yearFrom)) {
      query.append(QueryKey.YEAR_FROM, String(params.yearFrom));
    }

    if (Number.isFinite(params.yearTo)) {
      query.append(QueryKey.YEAR_TO, String(params.yearTo));
    }

    if (params.page !== 1) {
      query.append(QueryKey.PAGE, String(params.page));
    }

    if (query.size === 0) {
      return "";
    }

    return `?${query}`;
  }
}
