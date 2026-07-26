import { BadRequestException } from '@nestjs/common';

// Only allow simple column names: letters, digits, underscores, dots (for relations).
// Rejects anything that could be used as an injection vector (spaces, quotes, functions).
const SAFE_COLUMN = /^[a-zA-Z_][a-zA-Z0-9_.]*$/;

export function safeSortBy(sortBy?: string): string | undefined {
  if (!sortBy) return undefined;
  if (!SAFE_COLUMN.test(sortBy)) {
    throw new BadRequestException(`Invalid sortBy value: "${sortBy}"`);
  }
  return sortBy;
}
