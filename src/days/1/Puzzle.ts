import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  private getTotalCalories() {
    const calories = this.input.split('\r\n');
    const totalCalories: number[] = [];
    let total = 0;
    for (const calorie of calories) {
      if (calorie === '') {
        // Create new array
        totalCalories.push(total);
        total = 0;
      } else {
        total += parseInt(calorie);
      }
    }

    totalCalories.push(total);

    return totalCalories;
  }
  public solveFirst(): string {
    const totalCalories = this.getTotalCalories();

    return Math.max(...totalCalories).toString();
  }
  public solveSecond(): string {
    const totalCalories = this.getTotalCalories().sort((a, b) => b - a);

    return (totalCalories[0] + totalCalories[1] + totalCalories[2]).toString();
  }

  public getFirstExpectedResult(): string {
    return 'day 1 solution 1';
  }
  public getSecondExpectedResult(): string {
    return 'day 1 solution 2';
  }
}
