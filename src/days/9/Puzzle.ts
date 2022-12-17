import Puzzle from '../../types/AbstractPuzzle';
import readFile from '../../utils/readFile';

type Direction = 'U' | 'D' | 'L' | 'R';

interface Motion {
  direction: Direction;
  amount: number;
}

interface Position {
  x: number;
  y: number;
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const visited: Position[] = [];
    let head: Position = { x: 0, y: 0 };
    let tail: Position = { x: 0, y: 0 };
    visited.push({ x: 0, y: 0 });
    const motions = this.getMotions();

    for (const motion of motions) {
      const { direction, amount } = motion;
      for (let i = 0; i < amount; i++) {
        head = this.setHeadPosition(head, direction);
        tail = this.getTailPosition(tail, head);
        visited.push({ x: tail.x, y: tail.y });
      }
    }

    return this.getDedupedPositionsCount(visited);
  }

  public solveSecond(): string {
    const visited: Position[] = [];
    let head: Position = { x: 0, y: 0 };
    const tails: Position[] = Array(9).fill({ x: 0, y: 0 });
    visited.push({ x: 0, y: 0 });
    const motions = this.getMotions();

    for (const motion of motions) {
      const { direction, amount } = motion;
      for (let i = 0; i < amount; i++) {
        head = this.setHeadPosition(head, direction);
        for (let j = 0; j < tails.length; j++) {
          if (j === 0) {
            tails[j] = this.getTailPosition(tails[j], head);
          } else {
            tails[j] = this.getTailPosition(tails[j], tails[j - 1]);
          }
        }
        visited.push({ x: tails[8].x, y: tails[8].y });
      }
    }

    return this.getDedupedPositionsCount(visited);
  }

  private setHeadPosition(position: Position, direction: Direction) {
    if (direction === 'U') {
      position.y++;
    } else if (direction === 'D') {
      position.y--;
    } else if (direction === 'L') {
      position.x--;
    } else if (direction === 'R') {
      position.x++;
    } else {
      throw Error(`Unknown direction ${direction}`);
    }

    return position;
  }

  private getTailPosition(tail: Position, head: Position): Position {
    const pos: Position = {
      x: tail.x,
      y: tail.y,
    };
    const diffX = Math.abs(head.x - tail.x);
    const diffY = Math.abs(head.y - tail.y);
    if (diffX <= 1 && diffY <= 1) {
      return pos;
    }

    if (diffX === 0) {
      // Up or down
      pos.y += this.getDiff(head.y, tail.y);
    } else if (diffY === 0) {
      // Left or right
      pos.x += this.getDiff(head.x, tail.x);
    } else {
      // Diagonal
      pos.x += this.getDiff(head.x, tail.x);
      pos.y += this.getDiff(head.y, tail.y);
    }

    return pos;
  }

  private getDiff(num: number, num2: number) {
    if (num > num2) {
      return 1;
    } else {
      return -1;
    }
  }

  private getDedupedPositionsCount(positions: Position[]) {
    const dedupedPositions: Position[] = [];
    for (const position of positions) {
      if (
        !dedupedPositions.find((p) => p.x === position.x && p.y === position.y)
      ) {
        dedupedPositions.push(position);
      }
    }
    return dedupedPositions.length.toString();
  }

  private getMotions() {
    readFile('./src/days/9/input.txt').then((input) => this.setInput(input));
    return this.input.split('\n').map((x) => {
      const line = x.split(' ');
      return {
        direction: line[0],
        amount: parseInt(line[1], 10),
      } as Motion;
    });
  }
}
