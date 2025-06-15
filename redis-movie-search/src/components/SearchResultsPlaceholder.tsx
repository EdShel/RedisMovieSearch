import { MOVIE_SEARCH_PAGE_SIZE } from "@/utilities/constants";
import React from "react";
import { MovieCardPlaceholder } from "./MovieCard";

const SearchResultsPlaceholder: React.FC<object> = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array(MOVIE_SEARCH_PAGE_SIZE)
        .fill(0)
        .map((_, index) => (
          <MovieCardPlaceholder key={index} />
        ))}
    </div>
  );
};

export default SearchResultsPlaceholder;
