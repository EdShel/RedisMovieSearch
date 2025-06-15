"use client";

import MoviesSearchParamsParser from "@/utilities/MoviesSearchParamsParser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const SearchInput: React.FC = () => {
  const params = useSearchParams();
  const movieParams = useMemo(
    () => MoviesSearchParamsParser.parse(params),
    [params],
  );
  const [value, setValue] = useState<string>(movieParams.query);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setValue(movieParams.query);
  }, [movieParams]);

  const handleSearch = () => {
    const newQuery = MoviesSearchParamsParser.serialize({
      ...movieParams,
      query: value,
      page: 1,
    });
    router.push(`${pathname}${newQuery}`);
  };

  return (
    <div className="mx-auto my-4 flex w-full max-w-md items-center gap-2">
      <input
        type="search"
        name="Search query"
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
        onKeyDown={(ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            ev.stopPropagation();
            handleSearch();
          }
        }}
        placeholder="Search movie (title or cast)"
        className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 transition focus:ring-2 focus:ring-blue-500 focus:outline-none" 
      />
      <button
        onClick={handleSearch}
        className="rounded-r-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default SearchInput;
