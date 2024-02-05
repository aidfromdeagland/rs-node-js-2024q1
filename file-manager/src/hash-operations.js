import { createReadStream } from 'fs';
import { finished, pipeline } from 'node:stream/promises';
import { createHash } from 'crypto';

export const getHash = (filePath, hashAlgo = 'sha256', hashEncoding = 'hex') => {
  const reader = createReadStream(filePath);
  const hasher = createHash(hashAlgo).setEncoding(hashEncoding);

  return new Promise((resolve, reject) => {
    reader
      .on('error', () => {
        reject(error);
      })
      .pipe(hasher)
      .on('finish', () => {
        const hashResult = hasher.read();
        resolve(hashResult);
      })
      .on('error', () => {
        reject(error);
      })
  });
};
