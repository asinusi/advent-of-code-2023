import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const stream = this.input;
    let marker: number;
    for (let i = 0; i < stream.length; i++) {
      // Check for marker based on current index plus 4
      const letters = new Set(stream.slice(i, i + 4).split(''));

      if (letters.size === 4) {
        marker = i + 4;
        break;
      }
    }
    // Read the stream in 4 character chunks
    return marker.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'day 1 solution 1';
  }

  public solveSecond(): string {
    const stream = this.input;
    let marker: number;
    for (let i = 0; i < stream.length; i++) {
      // Check for marker based on current index plus 14
      const letters = new Set(stream.slice(i, i + 14).split(''));

      if (letters.size === 14) {
        marker = i + 14;
        break;
      }
    }
    // Read the stream in 4 character chunks
    return marker.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }
}
