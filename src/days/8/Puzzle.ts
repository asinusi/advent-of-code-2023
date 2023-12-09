import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const input = this.input.split('\n');
    const directions = input[0].split('').map((x) => (x === 'L' ? 0 : 1));
    input.splice(0, 2);

    // Add the input into a map
    const nodes = input.reduce((prev, curr) => {
      const [key, nodes] = curr
        .replace(')', '')
        .replace('(', '')
        .replace(',', '')
        .split(' = ');
      prev.set(key, nodes.split(' ') as [string, string]);
      return prev;
    }, new Map<string, [string, string]>());

    let steps = 0;
    let index = 0;
    let currentNode = 'AAA';
    const targetNode = 'ZZZ';
    while (true) {
      const direction = directions[index % directions.length];

      currentNode = nodes.get(currentNode)![direction];
      steps++;

      if (currentNode === targetNode) {
        break;
      }
      index++;
    }

    // WRITE SOLUTION FOR TEST 1
    return steps.toString();
  }

  private getFirstHit(
    nodes: Map<string, [string, string]>,
    directions: number[],
    currentNode: string
  ): number {
    let index = 0;
    let steps = 0;

    while (true) {
      const direction = directions[index % directions.length];
      // for (const direction of navigation) {
      currentNode = nodes.get(currentNode)![direction];
      steps++;

      if (currentNode[2] === 'Z') {
        break;
      }
      // }
      index++;
    }
    return steps;
  }

  public solveSecond(): string {
    const input = this.input.split('\n');
    const directions = input[0].split('').map((x) => (x === 'L' ? 0 : 1));
    input.splice(0, 2);

    // Add the input into a map
    const nodes = input.reduce((prev, curr) => {
      const [key, nodes] = curr
        .replace(')', '')
        .replace('(', '')
        .replace(',', '')
        .split(' = ');
      prev.set(key, nodes.split(' ') as [string, string]);
      return prev;
    }, new Map<string, [string, string]>());

    const currentNodes = Array.from(nodes.keys())
      .filter((x) => x[2] === 'A')
      .map((x) => this.getFirstHit(nodes, directions, x));

    // https://stackoverflow.com/questions/31302054/how-to-find-the-least-common-multiple-of-a-range-of-numbers
    const lcm = (a: number, b: number, x = a, y = b): number =>
      x == y
        ? x
        : x > y
          ? lcm(a, b, x, b * Math.ceil(x / b))
          : lcm(a, b, a * Math.ceil(y / a), y);

    const lcmAll = (ns: number[]): number =>
      ns.length == 0 ? 1 : lcm(ns[0], lcmAll(ns.slice(1)));

    const leastCommonMultiple = lcmAll(currentNodes);

    // WRITE SOLUTION FOR TEST 2
    return leastCommonMultiple.toString();
  }
}
