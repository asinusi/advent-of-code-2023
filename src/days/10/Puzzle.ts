import Puzzle from '../../types/AbstractPuzzle';
import readFile from '../../utils/readFile';

interface Instruction {
  type: 'noop' | 'addx';
  value?: number;
}

export default class ConcretePuzzle extends Puzzle {
  readonly strengths = [20, 60, 100, 140, 180, 220];
  public solveFirst(): string {
    let value = 1;
    const cycles: number[] = [];
    const program = this.readProgram();
    for (const instruction of program) {
      if (instruction.type === 'noop') {
        cycles.push(value);
      } else {
        cycles.push(value);
        cycles.push(value);
        value += instruction.value;
      }
    }
    return this.getTotalCycleStrengths(cycles).toString();
  }

  public solveSecond(): string {
    const crt: string[] = [];
    let sprite = 1;
    let cycle = 1;

    const executeCycle = () => {
      // Draw a pixel
      if ([sprite - 1, sprite, sprite + 1].includes((cycle - 1) % 40)) {
        crt.push('#');
      } else {
        crt.push('.');
      }

      cycle++;
    };

    const program = this.readProgram();
    for (const instruction of program) {
      // console.log({ instruction });
      if (instruction.type === 'noop') {
        executeCycle();
      } else {
        executeCycle();
        executeCycle();
        sprite += instruction.value;
      }
    }

    let image = '';
    for (let i = 0; i < crt.length; i++) {
      if (i % 40 === 0) {
        image += `\n${crt[i]}`;
      } else {
        image += crt[i];
      }
    }
    return image;
  }

  private getTotalCycleStrengths(cycles: number[]) {
    return this.strengths.reduce(
      (sum, strength) => sum + cycles[strength - 1] * strength,
      0
    );
  }

  private readProgram() {
    readFile('./src/days/10/input.txt').then((input) => this.setInput(input));
    return this.input.split('\n').map((x) => {
      const tmp = x.split(' ');
      return {
        type: tmp[0],
        value: parseInt(tmp[1], 10),
      } as Instruction;
    });
  }
}
