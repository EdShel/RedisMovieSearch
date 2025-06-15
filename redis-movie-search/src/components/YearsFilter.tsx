"use client";

import MoviesSearchParamsParser from "@/utilities/MoviesSearchParamsParser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import CollapsiblePanel from "./CollapsiblePanel";

interface Props {
  yearsRange: { minYear: number; maxYear: number };
}

type SelectedYearsRange = {
  yearFrom: number | null;
  yearTo: number | null;
};

const YearsFilter: React.FC<Props> = ({ yearsRange: { minYear, maxYear } }) => {
  const params = useSearchParams();
  const movieParams = useMemo(
    () => MoviesSearchParamsParser.parse(params),
    [params],
  );
  const [selectedRange, setSelectedRange] = useState<SelectedYearsRange>({
    yearFrom: movieParams.yearFrom,
    yearTo: movieParams.yearTo,
  });
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setSelectedRange({
      yearFrom: movieParams.yearFrom,
      yearTo: movieParams.yearTo,
    });
  }, [movieParams]);

  const handleYearChange = (range: SelectedYearsRange) => {
    setSelectedRange(range);
    console.log("range", range);
    const newParams = MoviesSearchParamsParser.serialize({
      ...movieParams,
      ...range,
      page: 1,
    });
    router.push(`${pathname}${newParams}`);
  };

  return (
    <CollapsiblePanel
      header="Years"
      isInitiallyExpanded={
        selectedRange.yearFrom !== null || selectedRange.yearTo !== null
      }
    >
      <div className="grid-template-columns-1 grid gap-x-4 gap-y-1 px-4 sm:grid-cols-2">
        <label htmlFor="yearFrom" className="font-semibold">
          From:
        </label>
        <label htmlFor="yearTo" className="font-semibold">
          To:
        </label>
        <select
          name="yearFrom"
          value={selectedRange.yearFrom ?? ""}
          onChange={(e) => {
            const newYearsFrom = e.target.value ? Number(e.target.value) : null;
            const newYearsTo =
              newYearsFrom !== null &&
              selectedRange.yearTo !== null &&
              newYearsFrom > selectedRange.yearTo
                ? newYearsFrom
                : selectedRange.yearTo;
            handleYearChange({ yearFrom: newYearsFrom, yearTo: newYearsTo });
          }}
          className="mb-2 w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">No limit</option>
          {Array.from({ length: maxYear - minYear + 1 }, (_, i) => (
            <option key={i} value={minYear + i}>
              {minYear + i}
            </option>
          ))}
        </select>
        <select
          name="yearTo"
          value={selectedRange.yearTo ?? ""}
          onChange={(e) => {
            const newYearsTo = e.target.value ? Number(e.target.value) : null;
            const newYearsFrom =
              newYearsTo !== null &&
              selectedRange.yearFrom !== null &&
              newYearsTo < selectedRange.yearFrom
                ? newYearsTo
                : selectedRange.yearFrom;
            handleYearChange({ yearFrom: newYearsFrom, yearTo: newYearsTo });
          }}
          className="mb-2 w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">No limit</option>
          {Array.from({ length: maxYear - minYear + 1 }, (_, i) => (
            <option key={i} value={minYear + i}>
              {minYear + i}
            </option>
          ))}
        </select>
      </div>
    </CollapsiblePanel>
  );
};

export default YearsFilter;
