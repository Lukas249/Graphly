export function getLineCount(input: string): number {
  if (input.length === 0) {
    return 1;
  }

  let lines = 1;

  for (let i = 0; i < input.length; i += 1) {
    if (input.charCodeAt(i) === 10) {
      lines += 1;
    }
  }

  return lines;
}
