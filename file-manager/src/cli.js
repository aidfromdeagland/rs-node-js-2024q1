import { EOL, homedir } from 'node:os';
import { printColors, whiteSpaceSplitRegex, quoteRegex } from './shared.js';
import * as FileOps from './file-operations.js';
import * as DirectoryOps from './directory-operations.js';
import * as NavOps from './navigation-operations.js';

const invalidInputMessage = `${printColors.red}Invalid input${EOL}${printColors.reset}`;
const operationFailedMessage = `${printColors.red}Operation failed${EOL}${printColors.reset}`;
let userName = '';

const handleExit = (args) => {
  process.exit(0);
}
const handleUp = (args) => {
  NavOps.changeDirectory('../');
}
const handleChangeDirectory = (args) => {
  NavOps.changeDirectory(args[0]);
}
const handleList = async (args) => {
  await DirectoryOps.printContentInTable(args[0]);
}
const handleConcatenation = async (args) => {
  await FileOps.read(args[0], process.stdout);
};
const handleAdd = async (args) => {
  await FileOps.add(args[0], process.cwd());
}
const handleRename = async (args) => {
  await FileOps.rename(args[0], args[1]);
}

const commandHandlers = {
  ['.exit']: handleExit,
  ['up']: handleUp,
  ['cd']: handleChangeDirectory,
  ['ls']: handleList,
  ['cat']: handleConcatenation,
  ['add']: handleAdd,
  ['rn']: handleRename,
};

const printCurrentDirectory = () => {
  process.stdout.write(`You are currently in ${process.cwd()}${EOL}`);
}

const handleUserInput = async (input) => {
  // TODO: In case of unknown operation or invalid input
  // (missing mandatory arguments, wrong data in arguments, etc.) Invalid input message should be shown
  const [command, ...args] = input
    .match(whiteSpaceSplitRegex)
    .map(arg => arg.replaceAll(quoteRegex, ''));
  const handler = commandHandlers[command];

  if (handler) {
    await handler(args);
  } else {
    process.stdout.write(invalidInputMessage);
  }

  printCurrentDirectory();
};

const setName = (args) => {
  const argumentsEntries = args.map(entry => entry.split('='));
  const userNameEntry = argumentsEntries.find(entry => entry[0] === '--username');
  if (!userNameEntry) {
    throw new Error(`name is not provided`);
  }

  userName = userNameEntry[1];
};

export const start = (args) => {
  process.on('SIGINT', () => {
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    process.exit(0);
  })

  process.on('error', (error) => {
    console.error(error)
    process.stdout.write(operationFailedMessage);
  });

  process.on('unhandledRejection', (error) => {
    console.error(error)
    process.stdout.write(operationFailedMessage);
  });

  process.on('uncaughtException', (error) => {
    console.error(error)
    process.stdout.write(operationFailedMessage);
  });

  process.on('exit', () => {
    process.stdout.write(`Thank you for using File Manager, ${userName}, goodbye!${EOL}`);
  })

  process.stdin.on('data', (data) => {
    handleUserInput(data.toString().trim());
  });

  process.chdir(homedir());
  printCurrentDirectory();
  setName(args);
  process.stdout.write(`Welcome to the File Manager, ${userName}!${EOL}`);
}