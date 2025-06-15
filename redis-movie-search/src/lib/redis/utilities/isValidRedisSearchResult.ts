import RedisSearchResult from "../types/RedisSearchResult";

export default function isValidRedisSearchResult(
  result: unknown,
): result is RedisSearchResult {
  return (
    !!result &&
    typeof result === "object" &&
    "total" in result &&
    Number.isFinite(result.total) &&
    "documents" in result &&
    Array.isArray(result.documents)
  );
}
