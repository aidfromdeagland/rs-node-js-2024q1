import { EOL } from 'os';
const usernameRegexp = /^[a-z0-9_-]$/

let userName = '';

const setNameFromArgs = () => {
  const argumentsEntries = process.argv.slice(2).map(entry => entry.split('='));
  const userNameEntry = argumentsEntries.find(entry => entry[0] === '--username');
  if (!userNameEntry) {
    throw new Error(`name is not provided`);
  }

  userName = userNameEntry[1];
};

setNameFromArgs();

process.on('exit', () => {
  process.stdout.write(`Thank you for using File Manager, ${userName}, goodbye!${EOL}`);
})

process.stdout.write(`Welcome to the File Manager, ${userName}!${EOL}`);
