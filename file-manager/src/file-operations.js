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
  await fsPromises.appendFile(filePath, '');
};

export const rename = async (currentFile, newFile) => {
  await fsPromises.rename(currentFile, newFile);
};

export const copy = async (source, destination = `${source} copy`) => {
  await add(destination);
  const reader = createReadStream(source);
  const writer = createWriteStream(destination);
  reader.pipe(writer);
  await finished(writer);
};