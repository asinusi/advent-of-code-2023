import Puzzle from '../../types/AbstractPuzzle';
import { cloneDeep, zip } from 'lodash';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const patterns = this.input.split('\r\n\r\n').map((x) => x.split('\r\n').map((x) => x.split('')));

    let sum = 0;
    patterns.forEach((pattern) => {
      const { total } = this.calculatePatternTotal(pattern);
      sum += total;
    });

    // WRITE SOLUTION FOR TEST 1
    return sum.toString();
  }

  public solveSecond(): string {
    const patterns = this.input.split('\r\n\r\n').map((x) => x.split('\r\n').map((x) => x.split('')));

    let sum = 0;
    patterns.forEach((pattern) => {
      sum += this.getPatternTotal(pattern);
    });

    // WRITE SOLUTION FOR TEST 2
    return sum.toString();
  }

  private getPatternTotal(pattern: string[][]): number {
    const { x, y } = this.calculatePatternTotal(pattern);
    const width = pattern[0].length;
    const height = pattern.length;
    // Replace every character in the pattern to find a different match
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const patternClone = cloneDeep(pattern);
        patternClone[i][j] = patternClone[i][j] === '#' ? '.' : '#';

        const result = this.calculatePatternTotal(patternClone, { x, y });
        if (result.x === -1 && result.y === -1) {
          continue;
        }

        if (result.x !== x || result.y !== y) {
          return result.total;
        }
      }
    }
  }

  private calculatePatternTotal(pattern: string[][], exclude: { x: number; y: number } = { x: -1, y: -1 }) {
    let sum = 0;
    let horionztalIndex = -1;
    for (let i = 0; i < pattern.length - 1; i++) {
      if (exclude.x !== i && this.isHorizontalMatch(pattern, i)) {
        sum += (i + 1) * 100;
        horionztalIndex = i;
        break;
      }
    }

    const transposedPattern = zip(...pattern);
    let verticalIndex = -1;
    for (let i = 0; i < pattern[0].length - 1; i++) {
      if (exclude.y !== i && this.isHorizontalMatch(transposedPattern, i)) {
        sum += i + 1;
        verticalIndex = i;
        break;
      }
    }

    return { total: sum, x: horionztalIndex, y: verticalIndex };
  }

  private isHorizontalMatch(pattern: string[][], index: number): boolean {
    const height = pattern.length;
    const width = pattern[0].length;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const i2 = index * 2 + 1 - j;
        if (i2 <= 0 || i2 >= height) {
          continue;
        }
        if (pattern[j][i] !== pattern[i2][i]) {
          return false;
        }
      }
    }

    return true;
  }
}
