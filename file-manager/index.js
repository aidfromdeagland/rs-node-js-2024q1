import { EOL, homedir } from 'os';
import { } from 'path';
const usernameRegexp = /^[a-z0-9_-]$/;

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

setNameFromArgs();

process.on('exit', () => {
  process.stdout.write(`Thank you for using File Manager, ${userName}, goodbye!${EOL}`);
})

process.stdout.write(`Welcome to the File Manager, ${userName}!${EOL}`);
process.chdir(homedir());
printCurrentDirectory();
