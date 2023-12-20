import { PuzzleInterface } from './PuzzleInterface';

export default abstract class Puzzle implements PuzzleInterface {
  protected input: string;

  public async setInput(input: string) {
    this.input = input;
    this.init();
  }

  public init(): void {}

  public abstract solveFirst(): string;
  public abstract solveSecond(): string;
}
