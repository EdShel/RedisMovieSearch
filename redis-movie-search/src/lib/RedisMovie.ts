type RedisMovie = {
  title: string;
  year: number;
  cast: string[];
  genres: string[];
  thumbnail: string | null;
};
export default RedisMovie;
