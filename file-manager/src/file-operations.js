import { EOL } from 'node:os';
import { join } from 'node:path';
import { createReadStream } from 'node:fs';
import { appendFile } from 'node:fs/promises';
import { finished } from 'node:stream/promises';

export const read = async (path, writableStream) => {
  const handleData = (data) => {
    writableStream.write(`${data}${EOL}`);
  };

  const reader = createReadStream(path, { encoding: 'utf8' });
  reader.on('data', handleData);
  reader.on('error', () => {
    reader.destroy(new Error('Operation failed'));
  })

  await finished(reader);
};

export const add = async (fileName, path = './') => {
  const filePath = join(path, fileName);
  await appendFile(filePath, '');
};