import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const rows = this.input.split('\n');
    let index = 1;
    let row = 0;
    let order = 0;
    while (row < rows.length) {
      // Take the first two rows
      const left = JSON.parse(rows[row]);
      const right = JSON.parse(rows[row + 1]);
      const result = this.compare(left, right);
      if (result) {
        order += index;
      }
      index++;
      row += 3;
    }
    return order.toString();
  }

  public solveSecond(): string {
    const rows = this.input.split('\n');
    // Decoders
    const arrs = [[[2]], [[6]]];
    let row = 0;
    while (row < rows.length) {
      if (rows[row] !== '') {
        arrs.push(JSON.parse(rows[row]));
      }
      row++;
    }
    // Sort the list based on the comparer function
    const sortedValues = arrs.sort((a, b) => {
      const result = this.compare(b, a);
      if (result === true) {
        return 1;
      } else if (result === false) {
        return -1;
      } else {
        return 0;
      }
    });

    const packetIndices = [];
    for (let i = 0; i < sortedValues.length; i++) {
      if (sortedValues[i].length === 1 && sortedValues[i][0].length === 1) {
        const value = sortedValues[i][0][0];
        if (value === 2 || value === 6) {
          packetIndices.push(i + 1);
        }
      }
    }

    const result = packetIndices.reduce((a, b) => a * b, 1);
    return result.toString();
  }

  private compare(left: any, right: any): boolean {
    if (this.isNumber(left) && this.isArray(right)) {
      // Convert to array
      left = [left];
    } else if (this.isArray(left) && this.isNumber(right)) {
      right = [right];
    } else if (this.isNumber(left) && this.isNumber(right)) {
      return this.compareNums(left as number, right as number);
    }

    let i: number;
    for (i = 0; i < left.length && right.length; i++) {
      const result = this.compare(left[i], right[i]);
      if (result === true || result === false) {
        return result;
      }
    }

    if (left.length < right.length) {
      return true;
    } else if (left.length > right.length) {
      return false;
    } else {
      return null;
    }
  }

  private isNumber(obj: any) {
    return obj?.length === undefined;
  }
  private isArray(obj: any) {
    return obj?.length !== undefined;
  }

  private compareNums(left: number, right: number) {
    if (left === right) {
      return null;
    }
    if (left < right) {
      return true;
    }
    return false;
  }
}
