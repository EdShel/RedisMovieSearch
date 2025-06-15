import { Suspense } from "react";
import SearchInput from "@/components/SearchInput";
import SearchResults from "@/components/SearchResults";
import MoviesSearchParamsParser from "@/utilities/MoviesSearchParamsParser";
import Genres from "@/components/Genres";
import Years from "@/components/Years";
import SearchResultsPlaceholder from "@/components/SearchResultsPlaceholder";

interface Props {
  searchParams: Promise<Record<string, unknown>>;
}

const Home: React.FC<Props> = async ({ searchParams }) => {
  const params = await searchParams;
  const movieSearchParams = MoviesSearchParamsParser.parse(
    rscParamsToURLSearchParams(params),
  );

  return (
    <div className="min-h-screen bg-stone-100 p-8 font-[family-name:var(--font-inter)]">
      <div className="m-auto max-w-5xl pb-10">
        <h1 className="text-center text-6xl font-bold text-stone-900">
          Redis Movie Search
        </h1>

        <SearchInput />

        <Genres />
        <Years />

        <Suspense
          key={JSON.stringify(params)}
          fallback={<SearchResultsPlaceholder />}
        >
          <SearchResults movieSearchParams={movieSearchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;

function rscParamsToURLSearchParams(
  rscParams: Record<string, unknown>,
): URLSearchParams {
  const result = new URLSearchParams();
  for (const key in rscParams) {
    result.append(key, rscParams[key] as unknown as string);
  }
  return result;
}
