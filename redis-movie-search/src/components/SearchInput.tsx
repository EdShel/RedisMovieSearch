"use client";

import MoviesSearchParamsParser from "@/utilities/MoviesSearchParamsParser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const SearchInput: React.FC<object> = ({}) => {
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
    <div>
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
        placeholder="Search movie (name or cast)"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchInput;
