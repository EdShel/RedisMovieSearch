import React from "react";
import searchMoviesServerAction from "@/lib/searchMoviesServerAction";
import { MoviesSearchParams } from "@/utilities/MoviesSearchParams";

interface Props {
  movieSearchParams: MoviesSearchParams;
}

const SearchResults: React.FC<Props> = async ({ movieSearchParams }) => {
  const result = await searchMoviesServerAction(movieSearchParams);

  return (
    <div>
      <pre>{JSON.stringify(result, undefined, 2)}</pre>
    </div>
  );
};

export default SearchResults;
