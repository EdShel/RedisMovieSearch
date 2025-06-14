import dotenv from "dotenv";
import fs from "fs";
import StreamArray from "stream-json/streamers/StreamArray";
import { createClient } from "redis";
import RedisMovie from "@/lib/RedisMovie";

dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.REDIS_CONNECTION_STRING,
});

client.on("error", (err) => console.log("Redis Client Error", err));

async function run() {
  await client.connect();

  await client.ft.dropIndex("idx:movies", { DD: true });

  console.log("Creating index");
  const indexStatus = await client.ft.create(
    "idx:movies",
    {
      "$.title": {
        type: "TEXT",
        AS: "title",
        WEIGHT: 5,
        SORTABLE: true,
      },
      "$.cast": {
        type: "TEXT",
        AS: "cast",
        NOSTEM: true,
      },
      "$.year": {
        type: "NUMERIC",
        AS: "year",
        SORTABLE: true,
      },
      "$.genres": {
        type: "TAG",
        AS: "genres",
      },
    },
    {
      ON: "JSON",
      PREFIX: "movies:",
    },
  );
  console.log(`Index created: ${indexStatus}`);

  const stream = fs
    .createReadStream("./src/data/movies.json")
    .pipe(StreamArray.withParser());

  console.log("Start");

  let id = 0;
  let batch = client.multi();
  let batchSize = 0;
  for await (const { value } of stream) {
    const rawMovie = value as RawMovie;
    if (rawMovie.year < 1970) {
      continue;
    }

    id++;
    const redisKey = `movies:${id}`;
    console.log(`Creating movie: ${redisKey}`);

    const redisMovie: RedisMovie = {
      title: rawMovie.title,
      cast: rawMovie.cast,
      genres: rawMovie.genres,
      year: rawMovie.year,
      thumbnail: rawMovie.thumbnail ?? null,
    };
    batch.json.set(redisKey, "$", redisMovie);
    batchSize++;

    if (batchSize >= 100) {
      await batch.execAsPipeline();
      batch = client.multi();
      batchSize = 0;
    }
  }

  if (batchSize > 0) {
    await batch.execAsPipeline();
  }

  console.log("Movies are created");

  await client.quit();
}

run();

type RawMovie = {
  title: string;
  year: number;
  cast: string[];
  genres: string[];
  href?: string | null;
  extract?: string;
  thumbnail?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
};
