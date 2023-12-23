import Puzzle from '../../types/AbstractPuzzle';

type Pulse = 'low' | 'high';

type Module = { modules: string[] } & (
  | {
      type: '%';
      value: 'on' | 'off';
    }
  | {
      type: '&';
      value: Map<string, Pulse>;
    }
);

export default class ConcretePuzzle extends Puzzle {
  private broadcast: string[];
  private modules: Map<string, Module>;
  public override init() {
    this.modules = this.input.split('\n').reduce((acc, line) => {
      const [name, m] = line.split(' -> ');
      const modules = m.split(', ');

      if (name === 'broadcaster') {
        this.broadcast = modules;
      } else if (name[0] === '%') {
        acc.set(name.slice(1), {
          modules,
          type: '%',
          value: 'off',
        });
      } else {
        acc.set(name.slice(1), {
          modules,
          type: '&',
          value: new Map(),
        });
      }

      return acc;
    }, new Map<string, Module>());

    // Initialise conjuction modules
    for (const [name, module] of this.modules.entries()) {
      for (const target of module.modules) {
        if (this.modules.has(target)) {
          const targetModule = this.modules.get(target)!;
          if (targetModule.type === '&') {
            targetModule.value.set(name, 'low');
          }
        }
      }
    }
  }

  public solveFirst(): string | number {
    // WRITE SOLUTION FOR TEST 1
    const pulses = new Map<Pulse, number>([
      ['low', 0],
      ['high', 0],
    ]);
    for (let i = 0; i < 1000; i++) {
      // Pushes the button 1000 times
      // Each button press sends out a low pulse to the broadcaster channel
      pulses.set('low', pulses.get('low') + 1);
      const queue: { sender: string; target: string; output: Pulse }[] = this.broadcast.map((target) => ({
        sender: 'broadcaster',
        target,
        output: 'low',
      }));

      while (queue.length > 0) {
        const { sender, target, output: pulse } = queue.shift()!;

        pulses.set(pulse, pulses.get(pulse) + 1);

        if (!this.modules.has(target)) {
          continue;
        }

        const module = this.modules.get(target)!;
        if (module.type === '%') {
          // High pulses are ignored
          if (pulse === 'low') {
            module.value = module.value === 'on' ? 'off' : 'on';
            const output = module.value === 'on' ? 'high' : 'low';
            module.modules.forEach((x) => queue.push({ sender: target, target: x, output }));
          }
        } else if (module.type === '&') {
          // Update the memory of the module
          module.value.set(sender, pulse);
          // Check if all inputs are high
          let allHigh = true;
          for (const pulse of module.value.values()) {
            if (pulse === 'low') {
              allHigh = false;
              break;
            }
          }
          const output = allHigh ? 'low' : 'high';
          module.modules.forEach((x) => queue.push({ sender: target, target: x, output }));
        }
      }
    }

    return pulses.get('high') * pulses.get('low');
  }

  public solveSecond(): string | number {
    // WRITE SOLUTION FOR TEST 2
    return 'day 1 solution 2';
  }
}
