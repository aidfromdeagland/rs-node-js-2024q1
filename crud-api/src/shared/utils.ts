import { IncomingMessage } from 'node:http';
import { InvalidJSONStructure } from './errors.ts';

const uuidRegexp =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

export const isValidUUID = (id: string) => uuidRegexp.test(id);
export const isValidUserData = (data) => {
  if (!data) {
    return false;
  }
  if (typeof data.username !== 'string') {
    return false;
  }
  if (!Number.isInteger(data.age)) {
    return false;
  }
  if (
    !Array.isArray(data.hobbies) ||
    data.hobbies.some((hobby) => typeof hobby !== 'string')
  ) {
    return false;
  }

  return true;
};

export const getRequestBody = (req: IncomingMessage) =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let body: string;
    req
      .on('error', (error) => {
        reject(error);
      })
      .on('data', (chunk) => {
        chunks.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(chunks).toString();
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch (error) {
          reject(new InvalidJSONStructure());
        }
      });
  });
