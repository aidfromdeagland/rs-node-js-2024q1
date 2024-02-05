import { EOL, homedir } from 'os';
import { } from 'path';
import { readdir } from 'node:fs/promises';
const redPrintColor = '\x1b[31m';
const resetPrintColor = '\x1b[0m';

let userName = '';

const setNameFromArgs = () => {
  const argumentsEntries = process.argv.slice(2).map(entry => entry.split('='));
  const userNameEntry = argumentsEntries.find(entry => entry[0] === '--username');
  if (!userNameEntry) {
    throw new Error(`name is not provided`);
  }

  userName = userNameEntry[1];
};

const printCurrentDirectory = () => {
  process.stdout.write(`You are currently in ${process.cwd()}${EOL}`);
}

const changeDirectory = (path = './') => {
  try {
    process.chdir(path);
  } catch (error) {
    process.stdout.write(`${redPrintColor}Invalid input${EOL}${resetPrintColor}`);
  }
}

const handleUserInput = (data) => {
  if (data === '.exit') {
    process.exit();
  } else if (data === 'up') {
    changeDirectory('../');
    printCurrentDirectory();
  } else if (data.startsWith('cd ')) {
    const route = data.slice(3);
    changeDirectory(route);
    printCurrentDirectory();
  } else if (data.startsWith('ls')) {
    const route = data.slice(3);
    if (route.length > 0) {
      readDirectory(route);
    } else {
      readDirectory();
    }
    printCurrentDirectory();
  } else {
    process.stdout.write(`${redPrintColor}Invalid input${EOL}${resetPrintColor}`);
  }
};

const getDirEntityType = (dirEntity) => {
  if (dirEntity.isDirectory()) {
    return 'directory';
  } else if (dirEntity.isFile()) {
    return 'file';
  } else if (dirEntity.isSymbolicLink()) {
    return 'link';
  } else if (dirEntity.isBlockDevice()) {
    return 'block device';
  } else if (dirEntity.isCharacterDevice()) {
    return 'character device';
  }

  return 'unknown';
}

const readDirectory = async (path = './') => {
  try {
    const directoryContent = await readdir(path, { withFileTypes: true });
    const tableFormattedContent = directoryContent
      .map((dirEntity) => ({ name: dirEntity.name, type: getDirEntityType(dirEntity) }))
      .sort((a, b) => {
        if (a.type === b.type) {
          return a.name < b.name ? -1 : 1;
        }
        return a.type < b.type ? -1 : 1;
      });

    console.table(tableFormattedContent, ['name', 'type']);

  } catch (error) {
    process.stdout.write(`${redPrintColor}Invalid input${EOL}${resetPrintColor}`);
  }
}

setNameFromArgs();

process.on('exit', () => {
  process.stdout.write(`Thank you for using File Manager, ${userName}, goodbye!${EOL}`);
})

process.on('SIGINT', () => {
  process.exit();
})

process.on('error', () => {
  process.stdout.write('Operation failed');
});

process.stdout.write(`Welcome to the File Manager, ${userName}!${EOL}`);
process.chdir(homedir());
printCurrentDirectory();

process.stdin.on('data', (data) => {
  handleUserInput(data.toString().trim());
});
