import Puzzle from '../../types/AbstractPuzzle';

enum HandType {
  HighCard = 0,
  OnePair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  FullHouse = 4,
  FourOfAKind = 5,
  FiveOfAKind = 6,
}

export default class ConcretePuzzle extends Puzzle {
  private readonly joker = 'J';
  private readonly strength = [
    'A',
    'K',
    'Q',
    'J',
    'T',
    '9',
    '8',
    '7',
    '6',
    '5',
    '4',
    '3',
    '2',
    'J',
  ].reverse();

  private getMaxIndex(arr: [string, number][]) {
    let max = 0;
    let maxIndex = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][1] > max) {
        max = arr[i][1];
        maxIndex = i;
      }
    }

    return maxIndex;
  }

  private getHand(
    input: string,
    strengthenJoker = false
  ): {
    cards: string;
    bid: number;
    handType: HandType;
    strength: number[];
  } {
    const hand = input.split(' ')[0].split('');
    const uniqueChars = new Map<string, number>();
    const strength = [];
    for (let i = 0; i < hand.length; i++) {
      strength.push(this.strength.indexOf(hand[i]));
      if (uniqueChars.has(hand[i])) {
        uniqueChars.set(hand[i], uniqueChars.get(hand[i]) + 1);
      } else {
        uniqueChars.set(hand[i], 1);
      }
    }

    // HandType.FiveOfAKind -> HandType.FiveOfAKind
    if (
      strengthenJoker &&
      uniqueChars.has(this.joker) &&
      uniqueChars.size > 1
    ) {
      const keyvalues = Array.from(uniqueChars).filter(
        (x) => x[0] !== this.joker
      );
      const totalJoker = uniqueChars.get(this.joker);

      if (uniqueChars.size === 5) {
        // move to any other char
        uniqueChars.delete(this.joker);
        uniqueChars.set(keyvalues[0][0], 2);
      } else if (uniqueChars.size === 2) {
        uniqueChars.delete(this.joker);
      } else {
        uniqueChars.delete(this.joker);
        const maxIndex = this.getMaxIndex(keyvalues);
        uniqueChars.set(
          keyvalues[maxIndex][0],
          keyvalues[maxIndex][1] + totalJoker
        );
      }

      // uniqueChars.delete(this.joker);
      // // Move the Js into the highest letter
      // let max = 0;
      // let maxIndex = 0;
      // for (let i = 0; i < keyvalues.length; i++) {
      //   if (keyvalues[i][1] > max) {
      //     maxIndex = i;
      //     max = keyvalues[i][1];
      //   }
      // }

      // uniqueChars.set(
      //   keyvalues[maxIndex][0],
      //   keyvalues[maxIndex][1] + totalJoker
      // );

      // if (uniqueChars.size === 2) {
      //   uniqueChars.delete(this.joker);
      // } else if (uniqueChars.size === 3) {
      //   uniqueChars.delete(this.joker);
      //   if (totalJoker === 3) {
      //     // switch to other letter
      //     uniqueChars.set(keyvalues[0][0], 4);
      //   } else if (totalJoker === 2) {
      //     if (keyvalues[0][1] > keyvalues[1][1]) {
      //       uniqueChars.set(keyvalues[0][0], keyvalues[0][1] + 2);
      //     } else {
      //       uniqueChars.set(keyvalues[1][0], keyvalues[1][1] + 2);
      //     }
      //   } else {
      //     if (keyvalues[0][1] > keyvalues[1][1]) {
      //       if (keyvalues[0][1] > 3) {
      //         // debugger;
      //       }
      //       uniqueChars.set(keyvalues[0][0], keyvalues[0][1] + 1);
      //     } else {
      //       if (keyvalues[1][1] > 3) {
      //         // debugger;
      //       }
      //       uniqueChars.set(keyvalues[0][0], keyvalues[0][1] + 1);
      //     }
      //   }
      // } else if (uniqueChars.size === 4) {
      //   uniqueChars.delete(this.joker);
      //   if (totalJoker > 2) {
      //     debugger;
      //   }
      //   if (totalJoker === 2) {
      //     if (keyvalues[0][1] > 1) {
      //       debugger;
      //     }
      //     uniqueChars.set(keyvalues[0][0], 3);
      //   } else {
      //     // Fetch the key that has two values
      //     let max = 0;
      //     let maxIndex = 0;
      //     for (let i = 0; i < keyvalues.length; i++) {
      //       if (keyvalues[i][1] > max) {
      //         max = keyvalues[i][1];
      //         maxIndex = i;
      //       }
      //     }

      //     uniqueChars.set(keyvalues[maxIndex][0], 3);
      //   }
      // } else if (uniqueChars.size === 5) {
      //   // move to any other char
      //   uniqueChars.delete(this.joker);
      //   uniqueChars.set(keyvalues[0][0], 2);
      // }
    }

    // Depending on the uniqueness we can determine what type of card it is
    let handType: HandType;
    if (uniqueChars.size === 1) {
      handType = HandType.FiveOfAKind;
    } else if (uniqueChars.size === 2) {
      const counts = Array.from(uniqueChars.values());
      handType = counts.some((count) => count === 4)
        ? HandType.FourOfAKind
        : HandType.FullHouse;
    } else if (uniqueChars.size === 3) {
      const counts = Array.from(uniqueChars.values());
      handType = counts.some((count) => count === 3)
        ? HandType.ThreeOfAKind
        : HandType.TwoPair;
    } else if (uniqueChars.size === 4) {
      handType = HandType.OnePair;
    } else if (uniqueChars.size === 5) {
      handType = HandType.HighCard;
    }

    return {
      cards: input.split(' ')[0],
      bid: +input.split(' ')[1],
      handType,
      strength,
    };
  }

  public solveFirst(): string {
    const hands = this.input.split('\n').map((x) => this.getHand(x, false));
    const totalWinnings = hands
      .sort((a, b) => {
        // Compare type
        if (a.handType > b.handType) {
          return 1;
        } else if (a.handType < b.handType) {
          return -1;
        }

        // Compare strength
        for (let i = 0; i < a.strength.length; i++) {
          if (a.strength[i] > b.strength[i]) {
            return 1;
          } else if (a.strength[i] < b.strength[i]) {
            return -1;
          }
        }
        return 0;
      })
      .reduce((prev, curr, index) => {
        const winnings = curr.bid * (index + 1);
        return prev + winnings;
      }, 0);
    // WRITE SOLUTION FOR TEST 1
    return totalWinnings.toString();
    return '';
  }

  public solveSecond(): string {
    const hands = this.input.split('\n').map((x) => this.getHand(x, true));
    const totalWinnings = hands
      .sort((a, b) => {
        // Compare type
        if (a.handType > b.handType) {
          return 1;
        } else if (a.handType < b.handType) {
          return -1;
        }

        // Compare strength
        for (let i = 0; i < a.strength.length; i++) {
          if (a.strength[i] > b.strength[i]) {
            return 1;
          } else if (a.strength[i] < b.strength[i]) {
            return -1;
          }
        }
        return 0;
      })
      .reduce((prev, curr, index) => {
        const winnings = curr.bid * (index + 1);
        return prev + winnings;
      }, 0);

    // WRITE SOLUTION FOR TEST 2
    return totalWinnings.toString();
  }
}
