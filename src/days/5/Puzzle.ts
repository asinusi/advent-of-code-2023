import Puzzle from '../../types/AbstractPuzzle';
import readFile from '../../utils/readFile';

interface CrateInstruction {
  amount: number;
  fromCrate: number;
  toCrate: number;
}

export default class ConcretePuzzle extends Puzzle {
  crates: string[][];
  private isLetter(value: string) {
    return value.length === 1 && value.match(/[A-Z]/i);
  }
  private getCrates(positions: string[]) {
    // Read the positions backwards so we have the correct positions of the crates
    const positionRow = positions.length - 1;
    const cratePositions = positions[positionRow]
      .split(' ')
      .reduce((result, value) => {
        if (value !== '') {
          result.push(parseInt(value));
        }
        return result;
      }, [] as number[]);

    // positions.splice(positions.length - 1, 1);

    this.crates = cratePositions.map(() => []);
    // Crawl down each crate to find the value

    for (let i = positionRow - 1; i >= 0; i--) {
      const s = positions[i].split(' ');
      for (let j = 0; j < positions[i].length; j++) {
        const letter = positions[i][j];
        if (this.isLetter(letter)) {
          // Get the column based on the position of the letter
          const column = parseInt(positions[positionRow][j]);
          this.crates[column - 1].push(letter);
        }
      }

      // console.log({ crates: this.crates });
    }
  }

  private getInstruction(value: string) {
    // console.log({ value });
    const numbers = value
      .split(' ')
      .filter((x) => !isNaN(parseInt(x)))
      .map((x) => parseInt(x));
    return {
      amount: numbers[0],
      fromCrate: numbers[1] - 1,
      toCrate: numbers[2] - 1,
    } as CrateInstruction;
  }

  public solveFirst(): string {
    readFile('./src/days/3/input.txt').then((input) => this.setInput(input));

    const instructions = this.input.split('\n');
    // console.log(instructions[3].split(' '));
    // Read down until we get to our first instruction
    // const len = instructions.length;
    let index = 0;
    // this.crates = [];
    // eslint-disable-next-line no-constant-condition
    let cratesFound = false;
    while (true) {
      // console.log({ cratesFound, index });
      const currentRow = instructions[index];
      if (currentRow === undefined) {
        // console.log(index);
        break;
      }
      if (cratesFound) {
        // Process the instruction
        const instruction = this.getInstruction(currentRow);
        // console.log({ instruction });
        for (let i = 0; i < instruction.amount; i++) {
          const fromCrate = this.crates[instruction.fromCrate];
          // Take each crate from the top
          if (fromCrate.length > 0) {
            this.crates[instruction.toCrate].push(
              fromCrate[fromCrate.length - 1]
            );
            fromCrate.splice(fromCrate.length - 1, 1);
          }

          // console.log({ crates: this.crates });
        }
      } else if (currentRow.startsWith('move')) {
        this.getCrates(instructions.slice(0, index - 1));
        cratesFound = true;
        continue;
        // console.log(this.crates, index, instructions);
      }

      index++;
    }
    // Grab the top crate from each stack
    const topCrates = this.crates.map((x) => x[x.length - 1]).join('');

    return topCrates;
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'day 1 solution 1';
  }

  public solveSecond(): string {
    readFile('./src/days/3/input.txt').then((input) => this.setInput(input));

    const instructions = this.input.split('\n');
    // console.log(instructions[3].split(' '));
    // Read down until we get to our first instruction
    // const len = instructions.length;
    let index = 0;
    // this.crates = [];
    // eslint-disable-next-line no-constant-condition
    let cratesFound = false;
    while (true) {
      // console.log({ cratesFound, index });
      const currentRow = instructions[index];
      if (currentRow === undefined) {
        // console.log(index);
        break;
      }
      if (cratesFound) {
        // Process the instruction
        const instruction = this.getInstruction(currentRow);
        // console.log({ instruction });
        const fromCrate = this.crates[instruction.fromCrate];
        const fromCrateLen = fromCrate.length;
        // Move crates in chunks retaining their order
        this.crates[instruction.toCrate].push(
          ...fromCrate.slice(fromCrateLen - instruction.amount)
        );

        fromCrate.splice(fromCrateLen - instruction.amount);
        // console.log({ crates: this.crates });
      } else if (currentRow.startsWith('move')) {
        this.getCrates(instructions.slice(0, index - 1));
        cratesFound = true;
        continue;
        // console.log(this.crates, index, instructions);
      }

      index++;
    }
    // Grab the top crate from each stack
    const topCrates = this.crates.map((x) => x[x.length - 1]).join('');

    return topCrates;
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }
}
