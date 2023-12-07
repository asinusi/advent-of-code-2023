import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const lines = this.input.split('\n');
    const numbersToArray = (input: string) => {
      return input
        .split(': ')[1]
        .split(' ')
        .reduce((prev, curr) => {
          if (+curr) {
            prev.push(+curr);
          }
          return prev;
        }, [] as number[]);
    };
    const times = numbersToArray(lines[0]);
    const distances = numbersToArray(lines[1]);
    const wins: number[] = Array(times.length).fill(0);

    for (let i = 0; i < times.length; i++) {
      const time = times[i];
      const distance = distances[i];

      // Skip 0 since that always travels 0 mm
      for (let t = 1; t < time; t++) {
        const distanceTravelled = (time - t) * t;
        if (distanceTravelled > distance) {
          wins[i]++;
        }
      }
    }

    console.log(wins);

    // WRITE SOLUTION FOR TEST 1
    return wins.reduce((a, b) => a * b).toString();
  }

  public solveSecond(): string {
    const lines = this.input.split('\n');
    const getNumber = (input: string) => {
      return +input.split(': ')[1].replaceAll(' ', '');
    };
    const time = getNumber(lines[0]);
    const distance = getNumber(lines[1]);
    let wins = 0;

    for (let i = 1; i < time; i++) {
      const distanceTravelled = (time - i) * i;
      if (distanceTravelled > distance) {
        wins++;
      }
    }

    console.log(wins);

    // WRITE SOLUTION FOR TEST 2
    return wins.toString();
  }
}
