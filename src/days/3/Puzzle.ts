import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const lines = this.input.split('\n');
    const maxX = lines.length;
    const maxY = lines[0].length;
    let sum = 0;

    const isSymbol = (x: number, y: number) => {
      // Out of bounds
      if (x < 0 || x >= maxX || y < 0 || y >= maxY) {
        return false;
      }

      return lines[x][y] !== '.' && isNaN(+lines[x][y]);
    };

    for (let i = 0; i < lines.length; i++) {
      let start = 0;
      let j = 0;
      let num: string;
      while (j < maxY) {
        start = j;
        num = '';

        // Fetch the number
        while (!isNaN(+lines[i][j])) {
          num += lines[i][j];
          j++;
        }

        if (num) {
          // Left and right
          if (isSymbol(i, start - 1) || isSymbol(i, j)) {
            sum += parseInt(num);
          }

          // Top and bottom
          for (let y = start - 1; y <= j; y++) {
            if (isSymbol(i - 1, y) || isSymbol(i + 1, y)) {
              sum += parseInt(num);
            }
          }
        }

        j++;
      }
    }

    // WRITE SOLUTION FOR TEST 1
    return sum.toString();
  }

  public solveSecond(): string {
    const lines = this.input.split('\n');
    const maxX = lines.length;
    const maxY = lines[0].length;
    const gears = new Map<string, Set<number>>();

    const addGear = (x: number, y: number, num: number) => {
      // Out of bounds
      if (x < 0 || x >= maxX || y < 0 || y >= maxY) {
        return false;
      }

      if (lines[x][y] === '*') {
        const coords = x.toString() + y.toString();
        const val = gears.get(coords) ?? new Set<number>();
        val.add(num);
        gears.set(coords, val);
      }
    };

    for (let i = 0; i < lines.length; i++) {
      let start = 0;
      let j = 0;
      let numStr: string;
      while (j < maxY) {
        start = j;
        numStr = '';

        // Fetch the number
        while (!isNaN(+lines[i][j])) {
          numStr += lines[i][j];
          j++;
        }

        if (numStr) {
          const num = +numStr;
          // Left and right
          addGear(i, start - 1, num);
          addGear(i, j, num);

          // Top and bottom
          for (let y = start - 1; y <= j; y++) {
            addGear(i - 1, y, num);
            addGear(i + 1, y, num);
          }
        }

        j++;
      }
    }

    let sum = 0;
    for (const value of gears.values()) {
      if (value.size === 2) {
        sum += Array.from(value.values()).reduce(
          (prev, curr) => (prev *= curr)
        );
      }
    }
    // WRITE SOLUTION FOR TEST 2
    return sum.toString();
  }
}
