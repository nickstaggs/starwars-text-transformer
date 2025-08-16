/**
 * Calculates the dot product of two vectors.
 *
 * @param vec1 The first vector.
 * @param vec2 The second vector.
 * @returns The dot product of the two vectors.
 * @throws Error if the vectors have different lengths.
 */
export const dotProduct = (vec1: number[], vec2: number[]): number => {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same length.");
  }

  return vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
};
