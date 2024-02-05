import zlib from 'zlib';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import * as fsPromises from 'node:fs/promises';

export const compress = async (filePath, destinationPath) => {
  await fsPromises.appendFile(destinationPath, '', { flag: 'ax' });
  await pipeline(
    createReadStream(filePath),
    zlib.createBrotliCompress(),
    createWriteStream(destinationPath),
  );
};

export const decompress = async (filePath, destinationPath) => {
  await fsPromises.appendFile(destinationPath, '', { flag: 'ax' });
  await pipeline(
    createReadStream(filePath),
    zlib.createBrotliDecompress(),
    createWriteStream(destinationPath),
  );
};