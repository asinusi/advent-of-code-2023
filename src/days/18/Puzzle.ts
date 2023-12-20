import Puzzle from '../../types/AbstractPuzzle';

type Direction = 'L' | 'R' | 'U' | 'D';
type DigInstruction = {
  direction: Direction;
  length: number;
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const plans = this.input.split('\n').map((x) => {
      const [direction, length] = x.split(' ');
      return { direction, length: +length } as DigInstruction;
    });

    const total = this.calculateCubicMeters(plans);

    // WRITE SOLUTION FOR TEST 1
    return total.toString();
  }

  public solveSecond(): string {
    const directions = new Map<number, Direction>([
      [0, 'R'],
      [1, 'D'],
      [2, 'L'],
      [3, 'U'],
    ]);
    const plans = this.input.split('\n').map((x) => {
      const hex = x.split('#')[1].replaceAll(')', '');
      const direction = directions.get(+hex.at(hex.length - 1));
      const length = parseInt(hex.slice(0, hex.length - 1), 16);
      return { direction, length } as DigInstruction;
    });

    const total = this.calculateCubicMeters(plans);

    // WRITE SOLUTION FOR TEST 2
    return total.toString();
  }

  private calculateCubicMeters(plans: DigInstruction[]): number {
    const directions = new Map<string, [number, number]>([
      ['U', [-1, 0]],
      ['D', [1, 0]],
      ['L', [0, -1]],
      ['R', [0, 1]],
    ]);

    // keep track of our coordinates
    let x = 0;
    let y = 0;
    let boundary = 0;
    const coords: number[][] = [];
    for (const { direction, length } of plans) {
      const [x2, y2] = directions.get(direction);
      x += length * x2;
      y += length * y2;
      boundary += length;
      coords.push([x, y]);
    }

    // https://en.wikipedia.org/wiki/Shoelace_formula
    const length = coords.length;

    let sum = 0;

    for (let i = 0; i < length; i += 2) {
      sum += (coords[i][0] - coords[(i + 1) % length][0]) * (coords[i][1] + coords[(i + 1) % length][1]);
    }

    const area = Math.abs(sum) * 0.5;
    const interior = area - boundary / 2 + 1;

    // WRITE SOLUTION FOR TEST 1
    return interior + boundary;
  }
}
