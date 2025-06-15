import { createClient } from "redis";
import isValidRedisAggregationResult from "../utilities/isValidRedisAggregationResult";

export default async function getYearsRange() {
  const redisClient = createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });
  await redisClient.connect();

  try {
    const result = await redisClient.ft.aggregate("idx:movies", "*", {
      STEPS: [
        {
          type: "GROUPBY",
          REDUCE: [
            { type: "MIN", property: "@year", AS: "minYear" },
            { type: "MAX", property: "@year", AS: "maxYear" },
          ],
        },
      ],
    });

    if (!isValidRedisAggregationResult(result) || result.results.length !== 1) {
      throw new Error("Unexpected response");
    }

    const [{ minYear, maxYear }] = result.results;
    return { minYear: Number(minYear), maxYear: Number(maxYear) };
  } finally {
    await redisClient.quit();
  }
}
