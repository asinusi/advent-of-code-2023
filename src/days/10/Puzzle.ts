import Puzzle from '../../types/AbstractPuzzle';

type Position = {
  x: number;
  y: number;
};

enum Pipe {
  Vertical = '|',
  Horizontal = '-',
  NorthEastBend = 'L',
  NorthWestBend = 'J',
  SouthWestBend = '7',
  SouthEastBend = 'F',
}

export default class ConcretePuzzle extends Puzzle {
  readonly westPipes = ['-', 'J', '7'];
  readonly eastPipes = ['-', 'L', 'F'];
  readonly northPipes = ['|', 'L', 'J'];
  readonly southPipes = ['|', '7', 'F'];

  pipes: string[][];
  width: number;
  height: number;
  start: Position;
  loop: boolean[][];
  steps: number;
  tracker: [number, number][] = [];

  public override init(): void {
    this.pipes = this.input.split('\n').map((x) => x.split(''));
    this.width = this.pipes[0].length;
    this.height = this.pipes.length;
    this.start = this.getStartPosition();
    this.loop = new Array(this.height).fill(0).map(() => new Array(this.width).fill(false));
    this.steps = this.getSteps();
  }

  private getStartPosition() {
    let index = 0;
    while (index < this.height) {
      for (let j = 0; j < this.width; j++) {
        if (this.pipes[index][j] === 'S') {
          this.pipes[index][j] = 'F'; // Test data
          // this.pipes[index][j] = '-'; // Real data
          return { x: j, y: index };
        }
      }
      index++;
    }

    throw Error('Starting pipe not found');
  }

  private getSteps() {
    let position: Position = { x: this.start.x, y: this.start.y };
    let prevPosition = position;
    let step = 0;

    this.loop[this.start.y][this.start.x] = true;
    this.tracker.push([this.start.y, this.start.x]);

    while (true) {
      step++;
      const newPosition = this.traverse(prevPosition, position);
      this.loop[newPosition.y][newPosition.x] = true;
      this.tracker.push([newPosition.y, newPosition.x]);
      prevPosition = position;
      position = newPosition;

      if (position.x === this.start.x && position.y === this.start.y) {
        break;
      }
    }

    if (step % 2 !== 0) {
      throw new Error('Pipes were not looped correctly');
    }

    return step / 2;
  }

  private canTraverse(prevX: number, prevY: number, x: number, y: number): boolean {
    // Determine which pathways can be taken and traverse each one
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }

    const pipe = this.pipes[y][x];
    const prevPipe = this.pipes[prevY][prevX];
    const diffX = x - prevX;
    const diffY = y - prevY;
    if (diffX === 0) {
      if (diffY > 0) {
        return (
          this.northPipes.includes(pipe) &&
          prevPipe !== Pipe.NorthWestBend &&
          prevPipe !== Pipe.NorthEastBend &&
          prevPipe !== Pipe.Horizontal
        );
      } else {
        return (
          this.southPipes.includes(pipe) &&
          prevPipe !== Pipe.SouthWestBend &&
          prevPipe !== Pipe.SouthEastBend &&
          prevPipe !== Pipe.Horizontal
        );
      }
    }

    if (diffX > 0) {
      return (
        this.westPipes.includes(pipe) &&
        prevPipe !== Pipe.NorthWestBend &&
        prevPipe !== Pipe.SouthWestBend &&
        prevPipe !== Pipe.Vertical
      );
    } else {
      return (
        this.eastPipes.includes(pipe) &&
        prevPipe !== Pipe.NorthEastBend &&
        prevPipe !== Pipe.SouthEastBend &&
        prevPipe !== Pipe.Vertical
      );
    }
  }

  private traverse(prev: Position, pos: Position): Position {
    // Look in each direction and attempt traversal
    // West
    if (prev.x !== pos.x - 1 && this.canTraverse(pos.x, pos.y, pos.x - 1, pos.y)) {
      return { x: pos.x - 1, y: pos.y };
    }
    // East
    if (prev.x !== pos.x + 1 && this.canTraverse(pos.x, pos.y, pos.x + 1, pos.y)) {
      return { x: pos.x + 1, y: pos.y };
    }
    // South
    if (prev.y !== pos.y + 1 && this.canTraverse(pos.x, pos.y, pos.x, pos.y + 1)) {
      return { x: pos.x, y: pos.y + 1 };
    }
    // North
    if (prev.y !== pos.y - 1 && this.canTraverse(pos.x, pos.y, pos.x, pos.y - 1)) {
      return { x: pos.x, y: pos.y - 1 };
    }

    throw Error('Traversal route is incorrect');
  }

  public solveFirst(): string {
    // WRITE SOLUTION FOR TEST 1
    return this.steps.toString();
  }

  private isInLoop(x: number, y: number, direction: 'left' | 'right' | 'up' | 'down') {
    // If a tile is on the edge we assume it is part of the loop for
    if (
      (direction === 'left' && x === 0) ||
      (direction === 'right' && x === this.width) ||
      (direction === 'up' && y === 0) ||
      (direction === 'down' && y === this.height)
    ) {
      return true;
    }

    if (direction === 'left') {
      for (let i = x; i >= 0; i--) {
        if (this.loop[y][i]) {
          return this.loop[y][i];
        }
      }
    } else if (direction === 'right') {
      for (let i = x; i < this.width; i++) {
        if (this.loop[y][i]) {
          return this.loop[y][i];
        }
      }
    } else if (direction === 'up') {
      try {
        for (let i = y; i >= 0; i--) {
          if (this.loop[i][x]) {
            return this.loop[i][x];
          }
        }
      } catch (err) {
        debugger;
      }
    } else if (direction === 'down') {
      for (let i = y; i < this.height; i++) {
        if (this.loop[i][x]) {
          return this.loop[i][x];
        }
      }
    }

    // Hit a wall so we can assume it is a tile
    return false;
  }

  public solveSecond(): string {
    // console.log(this.tracker);
    // Get the max and min of each axis
    this.tracker.sort((a, b) => {
      if (a[0] > b[0]) {
        return 1;
      }
      if (a[0] < b[0]) {
        return -1;
      }

      if (a[1] > b[1]) {
        return 1;
      }

      if (a[1] < b[1]) {
        return -1;
      }

      return 0;
    });

    // console.log(this.tracker);
    const x = this.tracker.flatMap((x) => x[1]);
    const y = this.tracker.flatMap((x) => x[0]);
    const minX = Math.min(...x);
    const minY = Math.min(...y);
    const maxX = Math.max(...x);
    const maxY = Math.max(...y);
    const tiles = new Set<string>();

    for (let i = minY; i < maxY; i++) {
      for (let j = minX; j < maxX; j++) {
        if (this.loop[i][j]) {
          continue;
        }

        if (
          this.isInLoop(j, i, 'right') &&
          this.isInLoop(j, i, 'left') &&
          this.isInLoop(j, i, 'up') &&
          this.isInLoop(j, i, 'down')
        ) {
          tiles.add(i.toString() + j.toString());
        }
      }
    }
    // Follow two lines and figure out the gap in between
    // for (let i = 0; i < this.tracker.length; i++) {
    //   const [x, y] = this.tracker[i];
    // }

    // for (let i = minY; i < maxY; i++) {
    //   for (let j = minX; j < maxX; j++) {
    //     if (this.loop[i][j]) {
    //       continue;
    //     }

    //     // Determine if it's in the bounds of the tracked array

    //     if (
    //       this.isInLoop(j, i, 'right') &&
    //       this.isInLoop(j, i, 'left') &&
    //       this.isInLoop(j, i, 'up') &&
    //       this.isInLoop(j, i, 'down')
    //     ) {
    //       tiles.add(i.toString() + j.toString());
    //     }
    //   }
    // }

    console.log(minX, minY, maxX, maxY);

    return '';
    // const tiles = new Set<string>();
    // for (let i = 0; i < this.height; i++) {
    //   for (let j = 0; j < this.width; j++) {
    //     if (this.pipes[i][j] === '.') {
    //       if (
    //         this.isInLoop(j, i, 'right') &&
    //         this.isInLoop(j, i, 'left') &&
    //         this.isInLoop(j, i, 'up') &&
    //         this.isInLoop(j, i, 'down')
    //       ) {
    //         tiles.add(i.toString() + j.toString());
    //       }
    //     }
    //   }
    // }

    // // WRITE SOLUTION FOR TEST 2
    // return tiles.size.toString();
  }
}
