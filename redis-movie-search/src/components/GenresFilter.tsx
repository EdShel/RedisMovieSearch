"use client";

import React, { useEffect, useMemo, useState } from "react";
import MoviesSearchParamsParser from "@/utilities/MoviesSearchParamsParser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CollapsiblePanel from "./CollapsiblePanel";

interface Props {
  genres: string[];
}

const GenresFilter: React.FC<Props> = ({ genres }) => {
  const params = useSearchParams();
  const movieParams = useMemo(
    () => MoviesSearchParamsParser.parse(params),
    [params],
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    movieParams.genres,
  );
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setSelectedGenres(movieParams.genres);
  }, [movieParams]);

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    const newParams = MoviesSearchParamsParser.serialize({
      ...movieParams,
      genres: newGenres,
      page: 1,
    });
    setSelectedGenres(newGenres);
    router.push(`${pathname}${newParams}`);
  };

  return (
    <CollapsiblePanel
      header="Genres"
      isInitiallyExpanded={movieParams.genres.length > 0}
    >
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`rounded-lg px-3 py-1 text-sm font-medium ${
              selectedGenres.includes(genre)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } cursor-pointer`}
            onClick={() => toggleGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </CollapsiblePanel>
  );
};

export default GenresFilter;
