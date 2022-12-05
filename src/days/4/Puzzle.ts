import Puzzle from '../../types/AbstractPuzzle';
import readFile from '../../utils/readFile';

interface Assignment {
  start: number;
  end: number;
}

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    readFile('./src/days/3/input.txt').then((input) => this.setInput(input));

    const pairs = this.input.split('\n');

    // Check if each pair overlaps the assignments
    let overlaps = 0;
    for (const assignments of pairs) {
      const [first, second] = assignments
        .split(',')
        .map((x) => this.getMinMax(x));

      if (
        (first.start <= second.start && first.end >= second.end) ||
        (second.start <= first.start && second.end >= first.end)
      ) {
        overlaps++;
      }
    }

    // WRITE SOLUTION FOR TEST 1
    return overlaps.toString();
  }

  private getMinMax(value: string) {
    const result = value.split('-').map((x) => parseInt(x));
    return {
      start: result[0],
      end: result[1],
    } as Assignment;
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'day 1 solution 1';
  }

  public solveSecond(): string {
    readFile('./src/days/3/input.txt').then((input) => this.setInput(input));

    const pairs = this.input.split('\n');

    // Check if each pair overlaps the assignments
    let overlaps = 0;
    for (const assignments of pairs) {
      const [first, second] = assignments
        .split(',')
        .map((x) => this.getMinMax(x));

      if (
        (first.start <= second.start && first.end >= second.end) ||
        (second.start <= first.start && second.end >= first.end) ||
        (first.start <= second.start && first.end >= second.start) ||
        (second.start <= first.start && second.end >= first.start)
      ) {
        overlaps++;
      }
    }

    // WRITE SOLUTION FOR TEST 1
    return overlaps.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }
}
