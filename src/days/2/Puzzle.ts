import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private getShapeValue(shape: string) {
    // A = Rock, B = Paper, C = Scissors
    // X = Rock, Y = Paper, Z = Scissors
    if (shape === 'A' || shape === 'X') {
      return 1;
    } else if (shape === 'B' || shape === 'Y') {
      return 2;
    } else {
      return 3;
    }
  }

  public solveFirst(): string {
    const rounds = this.input.split('\n');
    let total = 0;
    for (const round of rounds) {
      const [p1, p2] = [
        this.getShapeValue(round[0]),
        this.getShapeValue(round[2]),
      ];

      const result = p1 - p2;

      if (result === 0) {
        // Draw
        total += 3;
      } else if (result === -1 || result === 2) {
        // Win
        total += 6;
      }

      total += p2;
    }
    return total.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'day 1 solution 1';
  }

  public solveSecond(): string {
    const rounds = this.input.split('\n');
    // console.log(test.length);
    // const rounds = test.slice(0, 4);
    let total = 0;
    for (const round of rounds) {
      const [p1, p2] = [
        this.getShapeValue(round[0]),
        this.getShapeValue(round[2]),
      ];

      if (p2 === 1) {
        // Lose the matchup
        if (p1 === 1) {
          total += 3;
        } else if (p1 === 2) {
          total += 1;
        } else {
          total += 2;
        }
      } else if (p2 === 2) {
        // Draw
        total += p1 + 3;
      } else {
        // Win
        if (p1 === 1) {
          total += 2;
        } else if (p1 === 2) {
          total += 3;
        } else {
          total += 1;
        }
        total += 6;
      }

      console.log({ p1, p2, total });
    }
    return total.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }
}
