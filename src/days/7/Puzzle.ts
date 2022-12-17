import Puzzle from '../../types/AbstractPuzzle';
import readFile from '../../utils/readFile';

interface FileInfo {
  name: string;
  size?: number;
  parent?: FileInfo;
  children: FileInfo[];
}

export default class ConcretePuzzle extends Puzzle {
  readonly MAX_SIZE = 100000;
  readonly DISK_SIZE = 70000000;
  readonly SPACE_NEEDED = 30000000;

  public solveFirst(): string {
    const files = this.getFiles();
    // Loop through each directory to get the size
    const dirs = this.getDirectoriesWithLimit(files[0]);
    const total = dirs.reduce((a, b) => a + b.size, 0);
    return total.toString();
  }

  public solveSecond(): string {
    const files = this.getFiles();
    // Calculate the total size of the directories
    const root = files[0];
    const currentSize = this.getSize(root);
    const total = this.DISK_SIZE - currentSize;
    const min = this.SPACE_NEEDED - total;
    // console.log({ currentSize, total, min });
    const dirs = this.getDirectoriesSize(root, min);
    // Get the smallest size of all the directories
    let size = total;
    for (const dir of dirs) {
      // console.log({ name: dir.name, size: dir.size });
      if (dir.size < size) {
        size = dir.size;
      }
    }

    return size.toString();
  }

  private getDirectoriesWithLimit(dir: FileInfo) {
    const dirs: FileInfo[] = [];
    this.traverseDirectory(dir, dirs);
    return dirs;
  }

  private getDirectoriesSize(dir: FileInfo, minSize: number) {
    const dirs: FileInfo[] = [];
    this.traverseDir(dir, dirs, minSize);
    return dirs;
  }

  private traverseDir(file: FileInfo, dirs: FileInfo[], minSize: number) {
    if (file.size === null) {
      const size = this.getSize(file);
      if (size > minSize) {
        file.size = size;
        dirs.push(file);
      }

      for (const subdir of file.children) {
        this.traverseDir(subdir, dirs, minSize);
      }
    }
  }

  private traverseDirectory(file: FileInfo, dirs: FileInfo[]) {
    if (file.size === null) {
      const size = this.getSize(file);
      if (size < this.MAX_SIZE) {
        file.size = size;
        dirs.push(file);
      }
      for (const subdir of file.children) {
        this.traverseDirectory(subdir, dirs);
      }
    }
  }

  private getSize(dir?: FileInfo): number {
    let size = 0;
    if (dir.children === null) {
      return dir.size;
    }

    // Drill down to get the size
    for (const subdir of dir.children) {
      size += this.getSize(subdir);
    }
    return size;
  }

  private getFiles() {
    readFile('./src/days/7/input.txt').then((input) => this.setInput(input));
    const files: FileInfo[] = [];
    // Manually create first node
    files.push({ name: '/', size: null, parent: null, children: [] });
    // Create dir tree with size and files/dir
    const filesystem = this.input.split('\n');
    let index = 0;
    let currentDirectory: FileInfo = files[0];
    const len = filesystem.length;
    while (index < len) {
      const command = filesystem[index].split(' ');
      const start = command[0];
      if (start === '$') {
        const action = command[1];
        // perform the command
        if (action === 'cd') {
          const dir = command[2];
          if (dir === '..') {
            // Move up the node
            currentDirectory = currentDirectory.parent;
          } else {
            // Move into the next node
            currentDirectory = currentDirectory.children.find(
              (x) => x.name === dir
            );
          }
        }
      } else if (start === 'dir') {
        const folder = command[1];
        currentDirectory.children.push({
          name: folder,
          size: null,
          parent: currentDirectory,
          children: [],
        });
      } else {
        // File listing with size + name
        // 29116 f
        const size = parseInt(command[0]);
        const name = command[1];
        currentDirectory.children.push({
          name,
          size,
          children: null,
          parent: currentDirectory,
        });
        // currentDirectory.size += size;
      }
      index++;
    }

    return files;
  }

  public getFirstExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 1;
    return 'day 1 solution 1';
  }

  public getSecondExpectedResult(): string {
    // RETURN EXPECTED SOLUTION FOR TEST 2;
    return 'day 1 solution 2';
  }
}
