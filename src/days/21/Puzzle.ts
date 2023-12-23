import { uniq, uniqBy } from 'lodash';
import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private grid: string[][];
  public override init() {
    this.grid = this.input.split('\n').map((line) => line.split(''));
  }

  public solveFirst(): string | number {
    const [sr, sc] = this.getStartingNode();

    // Keep looping until all nodes have been checked
    const plots = new Set<string>();
    const visited = new Set<string>();
    const queue = [[sr, sc, 64]];

    while (queue.length > 0) {
      const [r, c, steps] = queue.shift()!;

      if (steps % 2 === 0) {
        plots.add(this.getPlotHash(r, c));
      }
      if (steps === 0) {
        continue;
      }

      // Check all directions
      for (const [dr, dc] of [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ]) {
        // Check if out of bounds
        if (
          dr < 0 ||
          dr >= this.grid.length ||
          dc < 0 ||
          dc >= this.grid[0].length ||
          this.grid[dr][dc] === '#' ||
          visited.has(this.getPlotHash(dr, dc))
        ) {
          continue;
        }

        queue.push([dr, dc, steps - 1]);
        visited.add(this.getPlotHash(dr, dc));
      }
    }

    // WRITE SOLUTION FOR TEST 1
    return plots.size;
  }

  public solveSecond(): string | number {
    // WRITE SOLUTION FOR TEST 2
    return 'day 1 solution 2';
  }

  private getPlotHash(r: number, c: number) {
    return `${r}_${c}`;
  }

  private getStartingNode() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] === 'S') {
          return [i, j] as [number, number];
        }
      }
    }

    throw Error('Starting node not found');
  }
}
