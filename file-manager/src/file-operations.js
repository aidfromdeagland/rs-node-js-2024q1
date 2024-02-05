import { EOL } from 'node:os';
import * as path from 'node:path';
import * as fsPromises from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { finished } from 'node:stream/promises';

export const read = async (filePath, writableStream) => {
  const handleData = (data) => {
    writableStream.write(`${data}${EOL}`);
  };

  const reader = createReadStream(filePath, { encoding: 'utf8' });
  reader.on('data', handleData);
  reader.on('error', () => {
    reader.destroy(new Error('Operation failed'));
  })

  await finished(reader);
};

export const add = async (fileName, fileDirectory = './') => {
  const filePath = path.join(fileDirectory, fileName);
  await fsPromises.appendFile(filePath, '', { flag: 'ax' });
};

export const rename = async (filePath, newFileName) => {
  const fileDirectory = path.dirname(filePath);
  const renamedFilePath = path.join(fileDirectory, newFileName);
  await fsPromises.rename(filePath, renamedFilePath);
};

export const copy = async (filePath, destinationDirectory) => {
  const fileName = path.basename(filePath);
  const destinationFilePath = path.join(destinationDirectory, fileName);
  await add(destinationFilePath);
  const reader = createReadStream(filePath);
  const writer = createWriteStream(destinationFilePath);
  reader.pipe(writer);
  await finished(writer);
};