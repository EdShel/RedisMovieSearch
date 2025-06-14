"use server";

import { MoviesSearchParams } from "@/utilities/MoviesSearchParams";
import RedisMovie from "./RedisMovie";
import { createClient } from "redis";

export default async function searchMoviesServerAction(
  params: MoviesSearchParams,
): Promise<{ total: number; movies: RedisMovie[] }> {
  const redisClient = createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });
  await redisClient.connect();

  const { query, limit } = buildRedisSearchQuery(params);

  try {
    const result = await redisClient.ft.search("idx:movies", query, {
      RETURN: <(keyof RedisMovie)[]>[
        "title",
        "year",
        "cast",
        "genres",
        "thumbnail",
      ],
      LIMIT: limit,
    });

    console.log("query", query);
    console.log("limit", limit);
    console.log("result", JSON.stringify(result, null, 2));
    if (
      result &&
      typeof result === "object" &&
      "total" in result &&
      Number.isFinite(result.total) &&
      "documents" in result &&
      Array.isArray(result.documents)
    ) {
      return {
        total: result.total as number,
        movies: result.documents as RedisMovie[],
      };
    }

    throw new Error("Unexpected response");
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
    const genreTags = params.genres
      .map((g) => `{${escapeRedisString(g)}}`)
      .join("|");
    andConditions.push(`@genres:(${genreTags})`);
  }

  if (params.yearFrom !== null || params.yearTo !== null) {
    const from = params.yearFrom ?? "-inf";
    const to = params.yearTo ?? "+inf";
    andConditions.push(`@year:[${from} ${to}]`);
  }

  const pageSize = 20;
  const offset = (params.page - 1) * pageSize;

  return {
    query: andConditions.length > 0 ? andConditions.join(" ") : "*",
    limit: { from: offset, size: pageSize },
  };
}

function escapeRedisString(input: string): string {
  return input.replace(/([\-@{}[\]|!():])/g, "\\$1");
}
