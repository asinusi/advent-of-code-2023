import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private getSequence(sequence: number[]) {
    const values = [sequence];
    let index = 0;
    while (true) {
      const diff: number[] = [];
      for (let i = 1; i < values[index].length; i++) {
        diff.push(values[index][i] - values[index][i - 1]);
      }
      values.push(diff);
      index++;
      if (values[index].every((x) => x === 0)) {
        break;
      }
    }

    return values.reverse();
  }
  public solveFirst(): string {
    const sequences = this.input
      .split('\n')
      .map((x) => x.split(' ').map((x) => +x));

    let sum = 0;
    for (const sequence of sequences) {
      const diff = this.getSequence(sequence);
      // Calculate the placeholders
      for (let i = 0; i < diff.length; i++) {
        if (i === 0) {
          diff[i].push(0);
        } else {
          diff[i].push(
            diff[i][diff[i].length - 1] + diff[i - 1][diff[i - 1].length - 1]
          );
        }
      }

      sum += diff[diff.length - 1][diff[diff.length - 1].length - 1];
    }

    // WRITE SOLUTION FOR TEST 1
    return sum.toString();
  }

  public solveSecond(): string {
    const sequences = this.input
      .split('\n')
      .map((x) => x.split(' ').map((x) => +x));

    let sum = 0;
    for (const sequence of sequences) {
      const diff = this.getSequence(sequence);
      // Calculate the placeholders
      for (let i = 0; i < diff.length; i++) {
        if (i === 0) {
          diff[i].unshift(0);
        } else {
          diff[i].unshift(diff[i][0] - diff[i - 1][0]);
        }
      }

      sum += diff[diff.length - 1][0];
    }

    // WRITE SOLUTION FOR TEST 2
    return sum.toString();
  }
}
