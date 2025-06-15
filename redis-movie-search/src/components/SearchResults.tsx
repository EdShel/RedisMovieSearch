import React from "react";
import searchMovies from "@/lib/redis/queries/searchMovies";
import { MoviesSearchParams } from "@/utilities/MoviesSearchParams";
import MovieCard from "./MovieCard";
import Pagination from "./Pagination";

interface Props {
  movieSearchParams: MoviesSearchParams;
}

const SearchResults: React.FC<Props> = async ({ movieSearchParams }) => {
  const result = await searchMovies(movieSearchParams);

  if (result.totalPages <= 1 && result.documents.length === 0) {
    return (
      <div className="mt-6 text-center text-3xl text-gray-500">
        No results found.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {result.documents.map((doc) => (
          <MovieCard key={doc.id} movie={doc.value} />
        ))}
      </div>
      {result.totalPages > 1 && <Pagination totalPages={result.totalPages} />}
    </>
  );
};

export default SearchResults;
