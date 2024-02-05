export const changeDirectory = (path = './') => {
  process.chdir(path);
}