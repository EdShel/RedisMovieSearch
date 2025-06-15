import RedisAggregationResult from "../types/RedisAggregationResult";

export default function isValidRedisAggregationResult(
  result: unknown,
): result is RedisAggregationResult {
  return (
    !!result &&
    typeof result === "object" &&
    "total" in result &&
    Number.isFinite(result.total) &&
    "results" in result &&
    Array.isArray(result.results)
  );
}
