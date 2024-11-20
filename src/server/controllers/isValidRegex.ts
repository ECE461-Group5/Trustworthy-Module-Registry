export function isValidRegex (pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  }
  catch (error: unknown) {
    return false;
  }
}
