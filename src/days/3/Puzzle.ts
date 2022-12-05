import Puzzle from '../../types/AbstractPuzzle';
import readFile from '../../utils/readFile';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    readFile('./src/days/3/input.txt').then((input) => this.setInput(input));

    const rucksacks = this.input.split('\n');

    // Hold record of any letters that are in both compartments
    const currentLetters = new Map<string, number>();
    for (const rucksack of rucksacks) {
      // Split the rucksack into it's compartments
      const mid = rucksack.length / 2;
      const [first, second] = [
        rucksack.slice(0, mid),
        rucksack.slice(mid, rucksack.length),
      ];

      for (let i = 0; i < first.length; i++) {
        const letter = first[i];

        if (second.indexOf(letter) === -1) {
          continue;
        }

        const currentLetter = currentLetters.get(letter);
        if (currentLetter) {
          currentLetters.set(letter, currentLetter + 1);
        } else {
          currentLetters.set(letter, 1);
        }

        break;
      }
    }

    // Loop through the collected letters and get the sum based on the priority
    let sum = 0;
    currentLetters.forEach((count, letter) => {
      let value = 0;
      if (letter.toLowerCase() === letter) {
        value = letter.charCodeAt(0) - 96;
      } else {
        value = letter.charCodeAt(0) - 64 + 26;
      }
      sum += value * count;
    });
    return sum.toString();
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'day 1 solution 1';
  }

  public solveSecond(): string {
    readFile('./src/days/3/input.txt').then((input) => this.setInput(input));

    const rucksacks = this.input.split('\n');

    // Hold record of any letters that are in both compartments
    const currentLetters = new Map<string, number>();
    const max = rucksacks.length;
    let index = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Get all letters corresponding to the compartments into a record
      if (index >= max) {
        break;
      }

      // Dedupe the letters
      const dedupedRucksacks = rucksacks
        .slice(index, index + 3)
        .map((rucksack) => new Set([...rucksack]));

      // Find the letter that is common between all the sets
      let commonLetter = '';
      for (const letter of dedupedRucksacks.at(0).values()) {
        if (
          dedupedRucksacks[1].has(letter) &&
          dedupedRucksacks[2].has(letter)
        ) {
          commonLetter = letter;
          break;
        }
      }

      const currentLetter = currentLetters.get(commonLetter);
      if (currentLetter) {
        currentLetters.set(commonLetter, currentLetter + 1);
      } else {
        currentLetters.set(commonLetter, 1);
      }

      index += 3;
    }

    // Loop through the collected letters and get the sum based on the priority
    let sum = 0;
    currentLetters.forEach((count, letter) => {
      let value = 0;
      if (letter.toLowerCase() === letter) {
        value = letter.charCodeAt(0) - 96;
      } else {
        value = letter.charCodeAt(0) - 64 + 26;
      }
      sum += value * count;
    });

    return sum.toString();
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }
}
