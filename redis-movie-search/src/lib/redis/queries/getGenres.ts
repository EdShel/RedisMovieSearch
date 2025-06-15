import { createClient } from "redis";

export default async function getGenres(): Promise<string[]> {
  const redisClient = createClient({
    url: process.env.REDIS_CONNECTION_STRING,
  });
  await redisClient.connect();

  try {
    return (await redisClient.json.get("genres")) as string[];
  } finally {
    await redisClient.quit();
  }
}
