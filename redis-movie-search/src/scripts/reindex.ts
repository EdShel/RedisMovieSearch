import dotenv from "dotenv";
import fs from "fs";
import StreamArray from "stream-json/streamers/StreamArray";
import { createClient } from "redis";
import RedisMovie from "@/lib/redis/types/RedisMovie";

dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.REDIS_CONNECTION_STRING,
});

client.on("error", (err) => console.log("Redis Client Error", err));

async function run() {
  await client.connect();

  await dropMoviesIndexIfExists();
  await createMoviesIndex();
  await createMovies();
  await createGenres();

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

async function dropMoviesIndexIfExists() {
  try {
    await client.ft.dropIndex("idx:movies", { DD: true });
  } catch {
    console.log("Failed to drop movies index");
  }
}

async function createMoviesIndex() {
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
}

async function createMovies() {
  console.log("Start - createMovies");

  const stream = fs
    .createReadStream("./src/data/movies.json")
    .pipe(StreamArray.withParser());

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

  console.log("End - createMovies");
}

async function createGenres() {
  console.log("Start - createGenres");

  const genresJson = fs.readFileSync("./src/data/genres.json", "utf-8");
  const genres = JSON.parse(genresJson) as string[];
  console.log(`Inserting ${genres.length} genres`);
  await client.json.set("genres", "$", genres);

  console.log("End - createGenres");
}
