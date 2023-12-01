import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const lines = this.input.split('\n');
    let sum = 0;
    for (let i = 0; i < lines.length; i++) {
      let firstNumber;
      let lastNumber;
      for (let j = 0; j < lines[i].length; j++) {
        const potentialNumber = parseInt(lines[i][j]);
        if (!isNaN(potentialNumber)) {
          firstNumber = lines[i][j];
          break;
        }
      }

      for (let j = lines[i].length - 1; j >= 0; j--) {
        const potentialNumber = parseInt(lines[i][j]);
        if (!isNaN(potentialNumber)) {
          lastNumber = lines[i][j];
          break;
        }
      }

      sum += parseInt(firstNumber + lastNumber);
    }
    // WRITE SOLUTION FOR TEST 1
    return sum.toString();
  }

  public solveSecond(): string {
    const numbers = new Map<string, string>([
      ['one', '1'],
      ['two', '2'],
      ['three', '3'],
      ['four', '4'],
      ['five', '5'],
      ['six', '6'],
      ['seven', '7'],
      ['eight', '8'],
      ['nine', '9'],
    ]);
    const maxWordLength = 5;
    const lines = this.input.split('\n');

    let sum = 0;
    for (let i = 0; i < lines.length; i++) {
      let firstNumber;
      let lastNumber;
      for (let j = 0; j < lines[i].length; j++) {
        const potentialNumber = parseInt(lines[i][j]);
        // Check for number
        if (!isNaN(potentialNumber)) {
          firstNumber = lines[i][j];
          break;
        }
        // Check for number as letters
        const substr = lines[i].substring(j, maxWordLength + j);
        for (const [key, value] of numbers) {
          if (substr.startsWith(key)) {
            firstNumber = value;
            break;
          }
        }
        if (firstNumber) {
          break;
        }
      }

      for (let j = lines[i].length - 1; j >= 0; j--) {
        const potentialNumber = parseInt(lines[i][j]);
        if (!isNaN(potentialNumber)) {
          lastNumber = lines[i][j];
          break;
        }

        // Check for number as letters
        const substr = lines[i].substring(j, maxWordLength + j);
        for (const [key, value] of numbers) {
          if (substr.startsWith(key)) {
            lastNumber = value;
            break;
          }
        }

        if (lastNumber) {
          break;
        }
      }
      sum += parseInt(firstNumber + lastNumber);
    }

    // WRITE SOLUTION FOR TEST 2
    return sum.toString();
  }
}
