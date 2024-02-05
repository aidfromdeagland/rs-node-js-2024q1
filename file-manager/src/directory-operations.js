import { readdir } from 'node:fs/promises';

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

export const printContentInTable = async (path = './') => {
  const directoryContent = await readdir(path, { withFileTypes: true });
  const tableFormattedContent = directoryContent
    .map((dirEntity) => {
      return { name: dirEntity.name, type: getDirEntityType(dirEntity) };
    })
    .sort((a, b) => {
      if (a.type === b.type) {
        return a.name < b.name ? -1 : 1;
      }
      return a.type < b.type ? -1 : 1;
    });

  console.table(tableFormattedContent, ['name', 'type']);
}