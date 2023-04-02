export function shortId() {
  return Math.random().toString(36).substr(-8)
}

export function createMatrix(rows: number, cols: number, fill = 0) {
  const matrix: number[][] = []

  for (let i = 0; i < cols; i++) {
    matrix[i] = []
    for (let j = 0; j < rows; j++)
      matrix[i][j] = fill
  }

  return matrix
}
