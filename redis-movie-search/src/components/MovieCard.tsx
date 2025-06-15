import RedisMovie from "@/lib/redis/types/RedisMovie";
import React from "react";

interface Props {
  movie: RedisMovie;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  return (
    <div className="m-2 rounded-lg bg-white shadow-md">
      <div className="flex justify-center">
        <div className="flex h-100 w-full items-center justify-center overflow-hidden rounded-t-lg bg-gray-200">
          {movie.thumbnail ? (
            <img
              src={movie.thumbnail}
              alt={`${movie.title} poster`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-500">No Image Available</span>
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="text-2xl font-bold">
          {movie.title}&nbsp;
          <span className="text-lg text-amber-800">{movie.year}</span>
        </p>
        <p className="line-clamp-2 text-gray-600">{movie.cast.join(", ")}</p>
      </div>
    </div>
  );
};

export default MovieCard;
