import { EOL } from 'node:os';
import { createReadStream } from 'node:fs';
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
}