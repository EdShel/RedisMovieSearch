export default function escapeRedisString(input: string): string {
  return input.replace(/([\-@{}[\]|!():])/g, "\\$1");
}
