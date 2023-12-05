import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    let sum = 0;
    this.input.split('\n').forEach((card) => {
      // collect the winning cards
      const numbers = card.split(' | ');
      const winning = numbers[0].split(' ');
      winning.splice(0, 2);
      const holding = numbers[1].split(' ');

      sum += winning
        .filter((x) => x !== '' && holding.some((y) => y === x))
        .reduce((prev, curr, index) => {
          if (index === 0) {
            return 1;
          } else {
            return prev * 2;
          }
        }, 0);
    });

    // WRITE SOLUTION FOR TEST 1
    return sum.toString();
  }

  public solveSecond(): string {
    const cards = this.input.split('\n');
    const scratchcards: number[] = Array(cards.length).fill(1);
    cards.forEach((card, index) => {
      // collect the winning cards
      const numbers = card.split(' | ');
      const winning = numbers[0].split(' ');
      winning.splice(0, 2);
      const holding = numbers[1].split(' ');

      const matching = winning.filter(
        (x) => x !== '' && holding.some((y) => y === x)
      ).length;
      if (matching > 0) {
        // Then copy over for each of the scratchcards that you have
        const start = index + 1;
        // Each match creates a copy of the next cards
        const copies = scratchcards[index];
        for (let i = 0; i < copies; i++) {
          for (let j = start; j <= index + matching; j++) {
            scratchcards[j]++;
          }
        }
      }
    });

    const sum = scratchcards.reduce((prev, curr) => prev + curr, 0);
    // WRITE SOLUTION FOR TEST 2
    return sum.toString();
  }
}
