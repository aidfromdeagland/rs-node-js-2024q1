import * as os from 'node:os';

const MHzToGHzMultiplier = 2 ** 10;

const getEol = () => {
  return os.EOL;
};

const getCpuInfo = () => {
  const cpus = os.cpus();
  const message = cpus
    .map(coreInfo => `model: ${coreInfo.model}, clock rate: ${coreInfo.speed / MHzToGHzMultiplier}`)
    .join(os.EOL);

  return `total amount of cores: ${cpus.length}
${message}`;
};

const getHomeDir = () => {
  return os.homedir();
};

const getUserName = () => {
  return os.userInfo().username;
};

const getArchitecture = () => {
  return os.arch();
};

const commandHandlers = {
  ['--EOL']: getEol,
  ['--cpus']: getCpuInfo,
  ['--homedir']: getHomeDir,
  ['--username']: getUserName,
  ['--architecture']: getArchitecture,
};

export const handleCommand = (command) => {
  const handler = commandHandlers[command];
  return handler ? handler() : '';
}