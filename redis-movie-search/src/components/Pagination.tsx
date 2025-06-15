"use client";

import React, { useMemo } from "react";
import MoviesSearchParamsParser from "@/utilities/MoviesSearchParamsParser";
import { usePathname, useSearchParams } from "next/navigation";

interface Props {
  totalPages: number;
}

const Pagination: React.FC<Props> = ({ totalPages }) => {
  const params = useSearchParams();
  const movieParams = useMemo(
    () => MoviesSearchParamsParser.parse(params),
    [params],
  );
  const pathname = usePathname();

  const getPageUrl = (page: number): string => {
    const newParams = MoviesSearchParamsParser.serialize({
      ...movieParams,
      page,
    });
    return `${pathname}${newParams}`;
  };

  const pagination = getPagination(movieParams.page, totalPages);

  return (
    <nav className="mt-8 flex justify-center gap-2">
      {pagination.map((page, index) => {
        if (page === "...") {
          return (
            <span key={index} className="px-2 py-1 text-gray-500">
              ...
            </span>
          );
        }
        const isActive = page === movieParams.page;
        return (
          <a
            key={index}
            href={getPageUrl(page)}
            className={`rounded px-3 py-1 ${
              isActive
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </a>
        );
      })}
    </nav>
  );
};

export default Pagination;

function getPagination(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  const maxVisiblePages = 5;
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}
