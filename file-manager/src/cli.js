// TODO: take EOL and HOMEDIR from os-operations.js
import { EOL, homedir } from 'node:os';
import { printColors, whiteSpaceSplitRegex, quoteRegex } from './shared.js';
import * as FileOps from './file-operations.js';
import * as DirectoryOps from './directory-operations.js';
import * as NavOps from './navigation-operations.js';
import * as OsOps from './os-operations.js';
import * as HashOps from './hash-operations.js';
import * as CompressOps from './compress-operations.js';

const invalidInputMessage = `${printColors.red}Invalid input${EOL}${printColors.reset}`;
const operationFailedMessage = `${printColors.red}Operation failed${EOL}${printColors.reset}`;
const nameNotProvidedMessage = `${printColors.red}Please, run script again and provide username via: npm run start -- --username=your_username${EOL}${printColors.reset}`;
let userName = '';

const handleExit = (args) => {
  process.exit(0);
};
const handleUp = (args) => {
  NavOps.changeDirectory('../');
};
const handleChangeDirectory = (args) => {
  NavOps.changeDirectory(args[0]);
};
const handleList = async (args) => {
  await DirectoryOps.printContentInTable(args[0]);
};
const handleConcatenation = async (args) => {
  await FileOps.read(args[0], process.stdout);
};
const handleAdd = async (args) => {
  await FileOps.add(args[0], process.cwd());
};
const handleRename = async (args) => {
  await FileOps.rename(args[0], args[1]);
};
const handleCopy = async (args) => {
  await FileOps.copy(args[0], args[1]);
};
const handleMove = async (args) => {
  await FileOps.move(args[0], args[1]);
};
const handleRemove = async (args) => {
  await FileOps.remove(args[0]);
};
const handleOsCommand = (args) => {
  // TODO: consider refactoring (it looks like this handler should not be responsible for printing to stdout)
  const commandResult = OsOps.handleCommand(args[0]);
  if (commandResult) {
    process.stdout.write(`${commandResult}${EOL}`);
  } else {
    process.stdout.write(invalidInputMessage);
  }
};
const handleHash = async (args) => {
  const hash = await HashOps.getHash(args[0]);
  process.stdout.write(`${hash}${EOL}`);
}
const handlerCompress = async (args) => {
  await CompressOps.compress(args[0], args[1]);
}
const handlerDecompress = async (args) => {
  await CompressOps.decompress(args[0], args[1]);
}

const commandHandlers = {
  ['.exit']: handleExit,
  ['up']: handleUp,
  ['cd']: handleChangeDirectory,
  ['ls']: handleList,
  ['cat']: handleConcatenation,
  ['add']: handleAdd,
  ['rn']: handleRename,
  ['cp']: handleCopy,
  ['mv']: handleMove,
  ['rm']: handleRemove,
  ['os']: handleOsCommand,
  ['hash']: handleHash,
  ['compress']: handlerCompress,
  ['decompress']: handlerDecompress,
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

  userName = userNameEntry[1] || 'Incognito';
};

const setProcessHandlers = () => {
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
    if (error?.message === 'name is not provided') {
      process.stdout.write(nameNotProvidedMessage);
      process.exit(1);
    } else {
      console.error(error)
      process.stdout.write(operationFailedMessage);
    }
  });

  process.on('exit', (code) => {
    if (code === 0) {
      process.stdout.write(`Thank you for using File Manager, ${userName}, goodbye!${EOL}`);
    }
  });
};

export const start = (args) => {
  setProcessHandlers();
  setName(args);
  process.chdir(homedir());
  printCurrentDirectory();
  process.stdout.write(`Welcome to the File Manager, ${userName}!${EOL}`);
  process.stdin.on('data', (data) => {
    handleUserInput(data.toString().trim());
  });
}