import Puzzle from '../../types/AbstractPuzzle';

type Lens = {
  label: string;
  length: number;
};

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const strings = this.input.split(',');
    let total = 0;
    for (let i = 0; i < strings.length; i++) {
      total += this.hash(strings[i]);
    }
    // WRITE SOLUTION FOR TEST 1
    return total.toString();
  }

  public solveSecond(): string {
    const strings = this.input.split(',');
    const boxes: Lens[][] = new Array(256).fill(undefined).map(() => []);

    for (let i = 0; i < strings.length; i++) {
      // Check if we are removing or adding
      const command = strings[i];
      if (command.endsWith('-')) {
        const label = command.substring(0, command.length - 1);
        const index = this.hash(label);
        // Look for a lens with the same label
        const lensIndex = boxes[index].findIndex((x) => x.label === label);
        if (lensIndex >= 0) {
          boxes[index].splice(lensIndex, 1);
        }
      } else {
        const [label, length] = command.split('=');
        // Look for a lens with the same label
        const index = this.hash(label);
        const lensIndex = boxes[index].findIndex((x) => x.label === label);
        if (lensIndex >= 0) {
          boxes[index][lensIndex].length = +length;
        } else {
          boxes[index].push({ label, length: +length });
        }
      }
    }

    let total = 0;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].length > 0) {
        for (let j = 0; j < boxes[i].length; j++) {
          total += (i + 1) * (j + 1) * boxes[i][j].length;
        }
      }
    }
    // WRITE SOLUTION FOR TEST 2
    return total.toString();
  }

  private hash(str: string): number {
    let value = 0;
    for (let i = 0; i < str.length; i++) {
      value += str[i].charCodeAt(0);
      value *= 17;
      value %= 256;
    }

    return value;
  }
}
