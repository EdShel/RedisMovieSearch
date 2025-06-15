import RedisSearchResultDocument from "./RedisSearchResultDocument";

type RedisSearchResult = {
  total: number;
  documents: RedisSearchResultDocument[];
};
export default RedisSearchResult;
