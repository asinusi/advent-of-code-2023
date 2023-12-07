import Puzzle from '../../types/AbstractPuzzle';

export default class ConcretePuzzle extends Puzzle {
  public solveFirst(): string {
    const lines = this.input.split('\n');
    const len = lines.length;
    // Initialise the locations with the seeds
    const locations: number[] = lines[0]
      .split(': ')[1]
      .split(' ')
      .map((x) => +x);
    for (let i = 1; i < len; i++) {
      const line = lines[i];
      // Check if it's a map
      if (line.endsWith(':')) {
        i++;
        // Gather the maps
        const maps: number[][] = [];
        while (i < len) {
          if (lines[i] === '') {
            break;
          }

          maps.push(lines[i].split(' ').map((x) => +x));
          i++;
        }

        // For each location attempt to map it to one of the maps
        for (let j = 0; j < locations.length; j++) {
          const location = locations[j];
          const destinations: number[] = [];
          for (const map of maps) {
            const diff = location - map[1];
            if (location >= map[1] && map[2] >= diff && diff >= 0) {
              // Perform the calculation
              destinations.push(map[0] + (location - map[1]));
            }
          }

          // Assign a new location or the same if it cannot be mapped
          locations[j] =
            destinations.length > 0 ? Math.min(...destinations) : location;
        }

        // console.log(locations);
      }
    }

    // WRITE SOLUTION FOR TEST 1
    return Math.min(...locations).toString();
  }

  public solveSecond(): string {
    // Too difficult for me to solve :(
    // WRITE SOLUTION FOR TEST 2
    return '';
  }
}
