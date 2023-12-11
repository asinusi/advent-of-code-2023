import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  readonly logging = false;
  public solveFirst(): string {
    const universe = this.input.split('\n').map((x) => x.split(''));
    let width = universe[0].length;
    let height = universe.length;

    const x = new Array(width).fill(true);
    const y = new Array(height).fill(true);
    // Mark down the spaces that can be expanded
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (universe[i][j] !== '.') {
          x[j] = false;
          y[i] = false;
        }
      }
    }

    for (let i = x.length; i >= 0; i--) {
      if (x[i]) {
        universe.forEach((u) => u.splice(i, 0, '.'));
        width++;
      }
    }

    let index = 0;
    for (let i = 0; i < y.length; i++) {
      if (y[i]) {
        universe.splice(index, 0, new Array(width).fill('.'));
        height++;
        index++;
      }
      index++;
    }

    // Calculate the positions of the galaxies
    const galaxies: [number, number][] = [];
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (universe[i][j] !== '.') {
          galaxies.push([i, j]);
        }
      }
    }

    const distances = new Map<string, number>();
    for (let i = 0; i < galaxies.length; i++) {
      const [x1, y1] = galaxies[i];
      if (this.logging) {
        console.log(x1, y1);
      }

      // Loop for each one and calculate the distance
      galaxies.forEach(([x2, y2], index) => {
        // Don't calculate the current galaxy
        const id = [i, index].sort().toString();
        if (index === i || distances.has(id)) {
          return;
        }

        const diffX = Math.abs(x1 - x2);
        const diffY = Math.abs(y1 - y2);

        const distance = diffX + diffY;

        let sum = distances.get(id) ?? 0;
        sum += distance;
        distances.set(id, sum);
      });
    }

    const total = Array.from(distances.values()).reduce((x, y) => x + y);
    // WRITE SOLUTION FOR TEST 1
    return total.toString();
  }

  public solveSecond(): string {
    const universe = this.input.split('\n').map((x) => x.split(''));
    const width = universe[0].length;
    const height = universe.length;

    const xIntersection = new Array(width).fill(true);
    const yIntersection = new Array(height).fill(true);

    // Mark down the spaces that can be expanded
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (universe[i][j] !== '.') {
          xIntersection[j] = false;
          yIntersection[i] = false;
        }
      }
    }

    // Calculate the positions of the galaxies
    const galaxies: [number, number][] = [];
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (universe[i][j] !== '.') {
          galaxies.push([i, j]);
        }
      }
    }

    // let sum = 0;
    const distances = new Map<string, number>();
    for (let i = 0; i < galaxies.length; i++) {
      const [x1, y1] = galaxies[i];
      if (this.logging) {
        console.log(x1, y1);
      }
      // Loop for each one and calculate the distance
      galaxies.forEach(([x2, y2], index) => {
        // Don't calculate the current galaxy
        const id = [i, index].sort().toString();
        if (index === i || distances.has(id)) {
          return;
        }

        let sum = 0;
        // Check for intersections
        const [minX, maxX] = [Math.min(x1, x2), Math.max(x1, x2)];
        const [minY, maxY] = [Math.min(y1, y2), Math.max(y1, y2)];
        for (let x = minX; x < maxX; x++) {
          if (yIntersection[x]) {
            // sum += 99;
            sum += 999999;
          }
        }

        for (let y = minY; y < maxY; y++) {
          if (xIntersection[y]) {
            // sum += 99;
            sum += 999999;
          }
        }

        const diffX = Math.abs(x1 - x2);
        const diffY = Math.abs(y1 - y2);

        const distance = diffX + diffY;

        sum += distances.get(id) ?? 0;
        sum += distance;
        distances.set(id, sum);
      });
    }

    const total = Array.from(distances.values()).reduce((x, y) => x + y);

    // WRITE SOLUTION FOR TEST 2
    return total.toString();
  }
}
