import { cloneDeep } from 'lodash';
import Puzzle from '../../types/AbstractPuzzle';

type Workflow = {
  rules: Rule[];
  redirect: string;
};

type Rule = {
  letter: string;
  value: number;
  comparator: '>' | '<';
  workflow: string | 'A' | 'R';
};

export default class ConcretePuzzle extends Puzzle {
  workflows: Map<string, Workflow>;
  ratings: Array<Map<string, number>>;

  public override init(): void {
    const inputs = this.input.split('\n\n').map((x) => x.split('\n'));

    this.workflows = inputs[0].reduce((prev, curr) => {
      // decode the line
      const [key, values] = curr.split('{');
      const rules: Rule[] = [];
      let redirect: string;
      values.split(',').forEach((x) => {
        const mid = x.indexOf(':');
        if (mid > 0) {
          rules.push({
            letter: x[0],
            comparator: x[1] as '<' | '>',
            value: +x.slice(2, mid),
            workflow: x.slice(mid + 1),
          });
        } else {
          redirect = x.slice(0, x.length - 1);
        }
      });
      prev.set(key, {
        rules,
        redirect,
      });

      return prev;
    }, new Map<string, Workflow>());

    this.ratings = inputs[1].reduce((prev, curr) => {
      prev.push(
        new Map(
          curr
            .slice(1, curr.length - 1)
            .split(',')
            .map((x) => x.split('='))
            .map((x) => [x[0], +x[1]])
        )
      );
      return prev;
    }, new Array<Map<string, number>>());
  }

  public solveFirst(): string | number {
    let sum = 0;
    for (const rating of this.ratings) {
      if (this.isWorkflowAccepted(rating)) {
        sum += Array.from(rating.values()).reduce((prev, curr) => prev + curr, 0);
      }
    }
    // WRITE SOLUTION FOR TEST 1
    return sum;
  }

  public solveSecond(): string | number {
    const total = this.getWorkflowCombinations(
      new Map<string, [number, number]>([
        ['x', [1, 4000]],
        ['m', [1, 4000]],
        ['a', [1, 4000]],
        ['s', [1, 4000]],
      ]),
      'in'
    );

    // WRITE SOLUTION FOR TEST 2
    return total;
  }

  private getWorkflowCombinations(ratings: Map<string, [number, number]>, workflowName: string): number {
    if (workflowName === 'R') {
      return 0;
    }

    if (workflowName === 'A') {
      let product = 1;
      for (const [low, high] of ratings.values()) {
        product *= high - low + 1;
      }
      return product;
    }

    const { rules, redirect } = this.workflows.get(workflowName);
    let total = 0;
    let isRedirect = false;
    for (const { letter, value, comparator, workflow } of rules) {
      const [low, high] = ratings.get(letter);
      let truthArr: [number, number];
      let falseArr: [number, number];
      if (comparator === '<') {
        truthArr = [low, Math.min(value - 1, high)];
        falseArr = [Math.max(value, low), high];
      } else {
        truthArr = [Math.max(value + 1, low), high];
        falseArr = [low, Math.min(value, high)];
      }

      if (truthArr[0] <= truthArr[1]) {
        const copy = cloneDeep(ratings);
        copy.set(letter, truthArr);
        total += this.getWorkflowCombinations(copy, workflow);
      }
      if (falseArr[0] <= falseArr[1]) {
        ratings = cloneDeep(ratings);
        ratings.set(letter, falseArr);
      } else {
        isRedirect = true;
        break;
      }
    }

    if (!isRedirect) {
      total += this.getWorkflowCombinations(ratings, redirect);
    }

    return total;
  }

  private isWorkflowAccepted(ratings: Map<string, number>) {
    let workflow = this.workflows.get('in'); // Workflows always start at "in"

    while (true) {
      let redirected = false;
      // Loop through the workflow until we get the result we want
      for (const rule of workflow.rules) {
        // test the rule
        const value = ratings.get(rule.letter);
        if (this.isRuleAccepted(value, rule.comparator, rule.value)) {
          // Move to the next workflow
          if (rule.workflow === 'A') {
            return true;
          } else if (rule.workflow === 'R') {
            return false;
          }

          redirected = true;
          workflow = this.workflows.get(rule.workflow);
          break;
        }
      }

      if (!redirected) {
        // Move to the next workflow
        if (workflow.redirect === 'A') {
          return true;
        } else if (workflow.redirect === 'R') {
          return false;
        }

        workflow = this.workflows.get(workflow.redirect);
      }
    }
  }

  private isRuleAccepted(value: number, comparator: string, valueComparer: number) {
    if (comparator === '>') {
      return value > valueComparer;
    }

    if (comparator === '<') {
      return value < valueComparer;
    }

    throw Error('Invalid comparator');
  }
}
