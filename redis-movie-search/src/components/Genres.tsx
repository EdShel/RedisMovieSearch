import React from "react";
import getGenres from "@/lib/redis/queries/getGenres";
import GenresFilter from "./GenresFilter";

const Genres: React.FC<object> = async () => {
  const genres = await getGenres();

  return <GenresFilter genres={genres} />;
};

export default Genres;
