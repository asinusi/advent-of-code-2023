import Puzzle from '../../types/AbstractPuzzle';
import readFile from '../../utils/readFile';

export default class ConcretePuzzle extends Puzzle {
  grid: number[][];
  public solveFirst(): string {
    this.grid = this.getTreeGrid();
    const rows = this.grid.length;
    const cols = this.grid[0].length;
    // Skip the first and last row since we only care about the interior
    const exteriorRows = rows * 2;
    const exteriorCols = (cols - 2) * 2;
    let visible = exteriorRows + exteriorCols;
    // console.log({ rows, cols, visible, tt: this.grid[0] });
    for (let i = 1; i < rows - 1; i++) {
      for (let j = 1; j < cols - 1; j++) {
        if (this.treeIsVisible(i, j, rows, cols)) {
          // console.log({ i, j });
          visible++;
        }
      }
    }

    return visible.toString();
  }

  private treeIsVisible(
    row: number,
    column: number,
    maxRows: number,
    maxColumns: number
  ) {
    return (
      this.checkUp(row, column) ||
      this.checkDown(row, column, maxRows) ||
      this.checkLeft(row, column) ||
      this.checkRight(row, column, maxColumns)
    );
  }

  private checkUp(row: number, column: number) {
    const height = this.grid[row][column];
    row--;
    while (row >= 0) {
      if (this.grid[row][column] >= height) {
        return false;
      }
      row--;
    }

    return true;
  }

  private checkDown(row: number, column: number, maxRows: number) {
    const height = this.grid[row][column];
    row++;
    while (row < maxRows) {
      if (this.grid[row][column] >= height) {
        return false;
      }
      row++;
    }

    return true;
  }

  private checkLeft(row: number, column: number) {
    const height = this.grid[row][column];
    column--;
    while (column >= 0) {
      if (this.grid[row][column] >= height) {
        return false;
      }
      column--;
    }

    return true;
  }

  private checkRight(row: number, column: number, maxColumns: number) {
    const height = this.grid[row][column];
    column++;
    while (column < maxColumns) {
      if (this.grid[row][column] >= height) {
        return false;
      }
      column++;
    }

    return true;
  }

  private getTreeGrid() {
    readFile('./src/days/8/input.txt').then((input) => this.setInput(input));

    // Create a 2d array to loop through
    // All trees from the edges are automatically visible
    // Check each side if the tree is shorter
    return this.input.split('\r\n').reduce((trees, line) => {
      // Turn into array
      trees.push(
        Array.from(line).reduce((prev, curr) => {
          prev.push(parseInt(curr));
          return prev;
        }, [] as number[])
      );
      return trees;
    }, [] as number[][]);
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'day 1 solution 1';
  }

  public solveSecond(): string {
    this.grid = this.getTreeGrid();
    const rows = this.grid.length;
    const cols = this.grid[0].length;
    // Skip the first and last row since we only care about the interior
    let currentScore = 0;
    // console.log({ rows, cols, visible, tt: this.grid[0] });
    for (let i = 1; i < rows - 1; i++) {
      for (let j = 1; j < cols - 1; j++) {
        const score = this.getTreeScore(i, j, rows, cols);
        if (score > currentScore) {
          currentScore = score;
        }
      }
    }

    return currentScore.toString();
  }

  private getTreeScore(
    row: number,
    column: number,
    maxRows: number,
    maxColumns: number
  ) {
    return (
      this.getTreesUp(row, column) *
      this.getTreesDown(row, column, maxRows) *
      this.getTreesLeft(row, column) *
      this.getTreesRight(row, column, maxColumns)
    );
  }

  private getTreesUp(row: number, column: number) {
    const height = this.grid[row][column];
    row--;
    let score = 0;
    while (row >= 0) {
      score++;
      if (this.grid[row][column] >= height) {
        break;
      }
      row--;
    }

    return score;
  }

  private getTreesDown(row: number, column: number, maxRows: number) {
    const height = this.grid[row][column];
    row++;
    let score = 0;
    while (row < maxRows) {
      score++;
      if (this.grid[row][column] >= height) {
        break;
      }
      row++;
    }

    return score;
  }

  private getTreesLeft(row: number, column: number) {
    const height = this.grid[row][column];
    column--;
    let score = 0;
    while (column >= 0) {
      score++;
      if (this.grid[row][column] >= height) {
        break;
      }
      column--;
    }

    return score;
  }

  private getTreesRight(row: number, column: number, maxColumns: number) {
    const height = this.grid[row][column];
    column++;
    let score = 0;
    while (column < maxColumns) {
      score++;
      if (this.grid[row][column] >= height) {
        break;
      }
      column++;
    }

    return score;
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }
}
