import Puzzle from '../../types/AbstractPuzzle';

type ArithmeticOperator = '+' | '-' | '*' | '/';

class Monkey {
  items: number[] = [];
  arithmeticOperator: ArithmeticOperator;
  operationValue: number;
  useOldWorryLevel = false;
  operation(oldWorryLevel: number): number {
    if (this.useOldWorryLevel) {
      return this.performOperation(oldWorryLevel, oldWorryLevel);
    } else {
      return this.performOperation(oldWorryLevel, this.operationValue);
    }
  }

  private performOperation(oldWorryLevel: number, value: number) {
    if (this.arithmeticOperator === '+') {
      return oldWorryLevel + value;
    } else if (this.arithmeticOperator === '-') {
      return oldWorryLevel - value;
    } else if (this.arithmeticOperator === '*') {
      return oldWorryLevel * value;
    } else {
      return oldWorryLevel / value;
    }
  }

  testValue: number;
  successValue: number;
  failValue: number;
  test(worryLevel: number): number {
    if (worryLevel % this.testValue === 0) {
      return this.successValue;
    } else {
      return this.failValue;
    }
  }

  inspected = 0;
}

export default class ConcretePuzzle extends Puzzle {
  readonly WORRIED_MAX_ROUNDS = 20;
  readonly UNWORRIED_MAX_ROUNDS = 10000;
  public solveFirst(): string {
    const monkeys = this.getMonkeyInput();
    for (let i = 0; i < this.WORRIED_MAX_ROUNDS; i++) {
      for (const monkey of monkeys) {
        // Loop through each worry level and perform an operation
        for (const worryLevel of monkey.items) {
          const newWorryLevel = Math.floor(monkey.operation(worryLevel) / 3);
          // Fetch the monkey index to send the new items to
          const monkeyIndex = monkey.test(newWorryLevel);
          monkeys[monkeyIndex].items.push(newWorryLevel);
          monkey.inspected++;
        }
        monkey.items = [];
      }
    }

    // Get two highest inspection numbers
    const inspections = monkeys
      .sort((a, b) => b.inspected - a.inspected)
      .map((x) => x.inspected);
    const totalMonkeyBusiness = (inspections[0] * inspections[1]).toString();

    return totalMonkeyBusiness;
  }

  public solveSecond(): string {
    const monkeys = this.getMonkeyInput();
    const worryReduction = monkeys.reduce(
      (prev, curr) => prev * curr.testValue,
      1
    );
    for (let i = 0; i < this.UNWORRIED_MAX_ROUNDS; i++) {
      for (const monkey of monkeys) {
        // Loop through each worry level and perform an operation
        for (const worryLevel of monkey.items) {
          let newWorryLevel = monkey.operation(worryLevel);
          newWorryLevel %= worryReduction;

          // Fetch the monkey index to send the new items to
          const monkeyIndex = monkey.test(newWorryLevel);
          monkeys[monkeyIndex].items.push(newWorryLevel);
          monkey.inspected++;
        }
        monkey.items = [];
      }
    }

    // Get two highest inspection numbers
    const inspections = monkeys
      .sort((a, b) => b.inspected - a.inspected)
      .map((x) => x.inspected);
    console.log({ inspections });
    const totalMonkeyBusiness = (inspections[0] * inspections[1]).toString();

    return totalMonkeyBusiness;
  }

  private getMonkeyInput() {
    const rows = this.input.split('\n');
    const monkeys: Monkey[] = [];
    let row = 0;
    while (row < rows.length) {
      const monkey = this.getMonkey(rows.slice(row, row + 6));
      monkeys.push(monkey);
      row += 7;
    }

    return monkeys;
  }

  private getMonkey(input: string[]) {
    const monkey: Monkey = new Monkey();
    for (let row of input) {
      row = row.trimStart();
      if (row.startsWith('Starting')) {
        monkey.items = row
          .split(':')[1]
          .split(',')
          .map((x) => parseInt(x, 10));
      } else if (row.startsWith('Operation')) {
        const op = row.split(' ');
        monkey.operationValue = parseInt(op[op.length - 1], 10);
        if (isNaN(monkey.operationValue)) {
          monkey.useOldWorryLevel = true;
        }
        monkey.arithmeticOperator = op[op.length - 2] as ArithmeticOperator;
      } else if (row.startsWith('Test')) {
        monkey.testValue = this.getNumberFromInput(row);
      } else if (row.startsWith('If true')) {
        monkey.successValue = this.getNumberFromInput(row);
      } else if (row.startsWith('If false')) {
        monkey.failValue = this.getNumberFromInput(row);
      }
    }

    return monkey;
  }

  private getNumberFromInput(input: string) {
    const op = input.split(' ');
    return parseInt(op[op.length - 1], 10);
  }
}
