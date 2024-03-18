export function sanitizeInput(input: string, charLimit: number) {
  //Remove non-alphabeticals, capitalize everything, limit characters
  return input
    .replace(/[^A-Za-z]+/g, "")
    .toUpperCase()
    .slice(0, charLimit);
}
