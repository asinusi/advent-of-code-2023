import { cloneDeep, isEqual, unzip, zip } from 'lodash';
import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const platform = this.input.split('\n').map((x) => x.split(''));
    // Move the rocks north
    const width = platform[0].length;
    const height = platform.length;

    // Skip the first row since any rock as already as north as it can be
    for (let i = 1; i < height; i++) {
      for (let j = 0; j < width; j++) {
        // Loop backwards until we hit a cube shaped rock (#)
        if (platform[i][j] === 'O') {
          // move upwards until we hit any type of rock # or O
          let i2 = i - 1;
          while (i2 >= 0) {
            if (platform[i2][j] !== '.') {
              break;
            }
            i2--;
          }

          if (i2 !== i - 1) {
            // Swap rock positions
            platform[i2 + 1][j] = 'O';
            platform[i][j] = '.';
          }
        }
      }
    }

    const sum = this.calculateTotalLoad(platform);

    // WRITE SOLUTION FOR TEST 1
    return sum.toString();
  }

  public solveSecond(): string {
    let platform = this.input.split('\n').map((x) => x.split(''));
    const cycles = 1000000000;
    const rotations = new Map<string, number>();
    const rots = [];

    for (let i = 0; i < cycles; i++) {
      for (let j = 0; j < 4; j++) {
        platform = this.tiltPlatform(platform);
        // Rotate 90 deg clockwise
        platform = platform.map((val, index) => platform.map((row) => row[index]).reverse());
      }

      const hash = this.getPlatformHash(platform);
      if (rotations.has(hash)) {
        // Fetch the rotation for this hash
        const foundIndex = rotations.get(hash);
        const index = ((cycles - 1 - foundIndex) % (i - foundIndex)) + foundIndex;
        platform = rots[index];
        break;
      } else {
        rots.push(cloneDeep(platform));
        rotations.set(hash, i);
      }
    }

    const sum = this.calculateTotalLoad(platform);

    // WRITE SOLUTION FOR TEST 2
    return sum.toString();
  }

  private calculateTotalLoad(platform: string[][]) {
    const width = platform[0].length;
    const height = platform.length;
    let sum = 0;
    // Now count the rocks
    for (let i = 0; i < height; i++) {
      let rocks = 0;
      for (let j = 0; j < width; j++) {
        if (platform[i][j] === 'O') {
          rocks++;
        }
      }

      sum += rocks * (height - i);
    }

    return sum;
  }

  private getPlatformHash(platform: string[][]) {
    return platform.join('');
  }

  private tiltPlatform(platform: string[][]) {
    const width = platform[0].length;
    const height = platform.length;

    // Skip the first row since any rock as already as north as it can be
    for (let i = 1; i < height; i++) {
      for (let j = 0; j < width; j++) {
        // Loop backwards until we hit a cube shaped rock (#)
        if (platform[i][j] === 'O') {
          // move upwards until we hit any type of rock # or O
          let i2 = i - 1;
          while (i2 >= 0) {
            if (platform[i2][j] !== '.') {
              break;
            }
            i2--;
          }

          if (i2 !== i - 1) {
            // Swap rock positions
            platform[i2 + 1][j] = 'O';
            platform[i][j] = '.';
          }
        }
      }
    }

    return platform;
  }
}
