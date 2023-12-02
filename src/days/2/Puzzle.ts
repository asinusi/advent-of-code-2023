import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const bags = new Map<string, number>([
      ['red', 12],
      ['green', 13],
      ['blue', 14],
    ]);
    const games = this.input.split('\n');
    let sum = 0;

    for (let i = 0; i < games.length; i++) {
      const line = games[i].split(': ');
      const game = parseInt(line[0].split(' ')[1]);
      const colours = line[1]
        .replaceAll(';', '')
        .replaceAll(',', '')
        .split(' ');
      sum += game;
      for (let i = colours.length - 1; i >= 0; i--) {
        if (parseInt(colours[i - 1]) > bags.get(colours[i])) {
          sum -= game;
          break;
        }
        i--;
      }
    }
    // WRITE SOLUTION FOR TEST 1
    return sum.toString();
  }

  public solveSecond(): string {
    const games = this.input.split('\n');
    let sum = 0;

    for (let i = 0; i < games.length; i++) {
      const line = games[i].split(': ');
      const colours = line[1]
        .replaceAll(';', '')
        .replaceAll(',', '')
        .split(' ');
      const bags = new Map<string, number>([
        ['red', 0],
        ['green', 0],
        ['blue', 0],
      ]);
      for (let i = 0; i < colours.length; i++) {
        const value = parseInt(colours[i]);
        if (value > bags.get(colours[i + 1])) {
          bags.set(colours[i + 1], value);
        }
        i++;
      }

      sum += Array.from(bags.values()).reduce((x, y) => x * y);
    }
    // WRITE SOLUTION FOR TEST 2
    return sum.toString();
  }
}
