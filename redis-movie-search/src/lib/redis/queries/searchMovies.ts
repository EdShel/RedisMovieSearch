import { createClient } from "redis";
import { MoviesSearchParams } from "@/utilities/MoviesSearchParams";
import RedisMovie from "../types/RedisMovie";
import isValidRedisSearchResult from "../utilities/isValidRedisSearchResult";
import escapeRedisString from "../utilities/escapeRedisString";
import { MOVIE_SEARCH_PAGE_SIZE } from "@/utilities/constants";

type Result = {
  totalPages: number;
  documents: {
    id: string;
    value: RedisMovie;
  }[];
};

export default async function searchMovies(
  params: MoviesSearchParams,
): Promise<Result> {
  const redisClient = createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });
  await redisClient.connect();

  const { query, limit } = buildRedisSearchQuery(params);
  const sortBy = params.query.length > 0 ? "weight" : "latest";
  try {
    const result = await redisClient.ft.search("idx:movies", query, {
      RETURN: ["title", "year", "cast", "genres", "$.thumbnail"],
      LIMIT: limit,
      SORTBY:
        sortBy === "latest"
          ? {
              // TS is a bit wonky here
              BY: "year" as `@${string}`,
              DIRECTION: "DESC",
            }
          : undefined,
    });

    if (!isValidRedisSearchResult(result)) {
      throw new Error("Unexpected response");
    }

    return {
      totalPages: Math.ceil(result.total / MOVIE_SEARCH_PAGE_SIZE),
      documents: result.documents.map((doc) => ({
        id: doc.id,
        value: <RedisMovie>{
          title: doc.value.title,
          year: JSON.parse(doc.value.year) as number,
          cast: JSON.parse(doc.value.cast) as string[],
          genres: JSON.parse(doc.value.genres) as string[],
          thumbnail: doc.value["$.thumbnail"] ?? null,
        },
      })),
    };
  } finally {
    await redisClient.quit();
  }
}

function buildRedisSearchQuery(params: MoviesSearchParams): {
  query: string;
  limit: { from: number; size: number };
} {
  const andConditions: string[] = [];

  if (params.query) {
    const escapedQuery = escapeRedisString(params.query);
    andConditions.push(`(@title:${escapedQuery}|@cast:${escapedQuery})`);
  }

  if (params.genres.length > 0) {
    const genreTags = params.genres.map((g) => escapeRedisString(g)).join("|");
    andConditions.push(`@genres:{${genreTags}}`);
  }

  if (params.yearFrom !== null || params.yearTo !== null) {
    const from = params.yearFrom ?? "-inf";
    const to = params.yearTo ?? "+inf";
    andConditions.push(`@year:[${from} ${to}]`);
  }

  const offset = (params.page - 1) * MOVIE_SEARCH_PAGE_SIZE;

  return {
    query: andConditions.length > 0 ? andConditions.join(" ") : "*",
    limit: { from: offset, size: MOVIE_SEARCH_PAGE_SIZE },
  };
}
