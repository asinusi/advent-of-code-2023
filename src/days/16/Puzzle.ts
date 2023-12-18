import Puzzle from '../../types/AbstractPuzzle';

type Position = {
  x: number;
  y: number;
  direction: Direction;
};

enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

enum Tile {
  EmptySpace = '.',
  RightAngledMirror = '/',
  LeftAngledMirror = '\\',
  VerticalSplinter = '|',
  HorizontalSplinter = '-',
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const tiles: string[][] = this.input.split('\n').map((x) => x.split(''));

    const energizedCount = this.initiateEntry(tiles, 0, 0, Direction.Right);

    // WRITE SOLUTION FOR TEST 1
    return energizedCount.toString();
  }

  public solveSecond(): string {
    const tiles: string[][] = this.input.split('\n').map((x) => x.split(''));
    // Find the highest energised route by attacking each node edge and comparing the result
    const width = tiles[0].length;
    const height = tiles.length;
    let max = 0;
    // Top and bottom
    for (let i = 0; i < width; i++) {
      const [up, down] = [
        this.initiateEntry(tiles, height, i, Direction.Up),
        this.initiateEntry(tiles, 0, i, Direction.Down),
      ];

      const maxWidth = Math.max(up, down);
      if (maxWidth > max) {
        max = maxWidth;
      }
    }

    // Left and right
    for (let i = 0; i < height; i++) {
      const [left, right] = [
        this.initiateEntry(tiles, i, 0, Direction.Right),
        this.initiateEntry(tiles, i, width, Direction.Left),
      ];

      const maxHeight = Math.max(left, right);
      if (maxHeight > max) {
        max = maxHeight;
      }
    }

    // WRITE SOLUTION FOR TEST 2
    return max.toString();
  }

  private iterateTiles(
    tiles: string[][],
    position: Position,
    energized: Set<string>,
    breakouts: Position[],
    start: boolean
  ) {
    const width = tiles[0].length;
    const height = tiles.length;

    let newPositions: Position[];
    while (true) {
      if (!start) {
        // A shitty way to breakout of an infinite loop
        const breakIndex = breakouts.findIndex(
          (pos) => pos.x === position.x && pos.y === position.y && pos.direction === position.direction
        );
        if (breakIndex >= 0) {
          break;
        }
      }
      start = false;

      if (position.x < 0 || position.x >= width || position.y < 0 || position.y >= height) {
        break;
      }
      energized.add(this.hashCoordinates(position.x, position.y));

      switch (position.direction) {
        case Direction.Up:
          newPositions = this.moveUp(tiles, position.x, position.y);
          break;
        case Direction.Down:
          newPositions = this.moveDown(tiles, position.x, position.y);
          break;
        case Direction.Left:
          newPositions = this.moveLeft(tiles, position.x, position.y);
          break;
        case Direction.Right:
          newPositions = this.moveRight(tiles, position.x, position.y);
      }

      // A tile can produce one, two or no new positions
      if (newPositions.length === 1) {
        position = newPositions[0];
      } else {
        breakouts.push(position);
        for (let i = 0; i < newPositions.length; i++) {
          this.iterateTiles(tiles, newPositions[i], energized, breakouts, start);
        }
        break;
      }
    }
  }

  private initiateEntry(tiles: string[][], x: number, y: number, direction: Direction) {
    const energized = new Set<string>([this.hashCoordinates(x, y)]);
    const position: Position = { x, y, direction };
    this.iterateTiles(tiles, position, energized, [position], true);

    return energized.size;
  }

  private hashCoordinates(x: number, y: number) {
    return `${x}_${y}`;
  }

  private moveUp(tiles: string[][], x: number, y: number): Position[] {
    // Given coordinates where should the next position be
    const tile = tiles[x][y];

    switch (tile as Tile) {
      case Tile.EmptySpace:
      case Tile.VerticalSplinter:
        if (x - 1 < 0) {
          return [];
        }
        return [{ direction: Direction.Up, x: x - 1, y }];
      case Tile.RightAngledMirror:
        return [{ direction: Direction.Right, x, y: y + 1 }];
      case Tile.LeftAngledMirror:
        return [{ direction: Direction.Left, x, y: y - 1 }];
      case Tile.HorizontalSplinter:
        return [
          { direction: Direction.Left, x, y: y - 1 },
          { direction: Direction.Right, x, y: y + 1 },
        ];
      default:
        throw Error('Invalid tile');
    }
  }

  private moveDown(tiles: string[][], x: number, y: number): Position[] {
    // Given coordinates where should the next position be

    const tile = tiles[x][y];

    switch (tile as Tile) {
      case Tile.EmptySpace:
      case Tile.VerticalSplinter:
        if (x + 1 > tiles.length) {
          return [];
        }
        return [{ direction: Direction.Down, x: x + 1, y }];
      case Tile.RightAngledMirror:
        return [{ direction: Direction.Left, x, y: y - 1 }];
      case Tile.LeftAngledMirror:
        return [{ direction: Direction.Right, x, y: y + 1 }];
      case Tile.HorizontalSplinter:
        return [
          { direction: Direction.Left, x, y: y - 1 },
          { direction: Direction.Right, x, y: y + 1 },
        ];
      default:
        throw Error('Invalid tile');
    }
  }

  private moveLeft(tiles: string[][], x: number, y: number): Position[] {
    // Given coordinates where should the next position be
    const tile = tiles[x][y];

    switch (tile as Tile) {
      case Tile.EmptySpace:
      case Tile.HorizontalSplinter:
        if (y - 1 < 0) {
          return [];
        }
        return [{ direction: Direction.Left, x, y: y - 1 }];
      case Tile.RightAngledMirror:
        return [{ direction: Direction.Down, x: x + 1, y }];
      case Tile.LeftAngledMirror:
        return [{ direction: Direction.Up, x: x - 1, y }];
      case Tile.VerticalSplinter:
        return [
          { direction: Direction.Up, x: x - 1, y },
          { direction: Direction.Down, x: x + 1, y },
        ];
      default:
        throw Error('Invalid tile');
    }
  }

  private moveRight(tiles: string[][], x: number, y: number): Position[] {
    // Given coordinates where should the next position be
    const tile = tiles[x][y];

    switch (tile as Tile) {
      case Tile.EmptySpace:
      case Tile.HorizontalSplinter:
        if (y + 1 >= tiles[0].length) {
          return [];
        }
        return [{ direction: Direction.Right, x, y: y + 1 }];
      case Tile.RightAngledMirror:
        return [{ direction: Direction.Up, x: x - 1, y }];
      case Tile.LeftAngledMirror:
        return [{ direction: Direction.Down, x: x + 1, y }];
      case Tile.VerticalSplinter:
        return [
          { direction: Direction.Up, x: x - 1, y },
          { direction: Direction.Down, x: x + 1, y },
        ];
      default:
        throw Error('Invalid tile');
    }
  }
}
