import { IncomingMessage, ServerResponse } from 'node:http';
import { UsersRepository, UserModel } from '../repositories/users.ts';
import { isValidUUID, isValidUserData, getRequestBody } from '../shared/utils.ts';
import {
  BadRequestError,
  InvalidUserIdError,
  InvalidUserPayloadError,
  InvalidRouteError,
} from '../shared/errors.ts';

const getId = (url = '') => {
  const [, , id] = url.split('/').filter((route) => !!route);
  return id;
};

const methodHandlers = new Map([
  [
    'GET',
    async (req: IncomingMessage, res: ServerResponse) => {
      const id = getId(req.url);
      if (id) {
        if (!isValidUUID(id)) {
          throw new InvalidUserIdError();
        }

        const user = await UsersRepository.getById(id);
        res.writeHead(200);
        res.end(JSON.stringify(user));
      }

      const users = await UsersRepository.getAll();
      res.writeHead(200);
      res.end(JSON.stringify(users));
    },
  ],
  [
    'POST',
    async (req: IncomingMessage, res: ServerResponse) => {
      const id = getId(req.url);
      if (id) {
        throw new InvalidRouteError();
      }

      const body = await getRequestBody(req);
      if (!isValidUserData(body)) {
        throw new InvalidUserPayloadError();
      }

      const { username, age, hobbies } = body as Omit<UserModel, 'id'>;
      const user = await UsersRepository.create({ username, age, hobbies });
      res.writeHead(201);
      res.end(JSON.stringify(user));
    },
  ],
  [
    'PUT',
    async (req: IncomingMessage, res: ServerResponse) => {
      const id = getId(req.url);
      if (!id) {
        throw new BadRequestError();
      }

      if (!isValidUUID(id)) {
        throw new InvalidUserIdError();
      }

      const body = await getRequestBody(req);
      if (!isValidUserData(body)) {
        throw new InvalidUserPayloadError();
      }

      const { username, age, hobbies } = body as Omit<UserModel, 'id'>;
      const user = await UsersRepository.update(id, { username, age, hobbies });
      res.writeHead(201);
      res.end(JSON.stringify(user));
    },
  ],
  [
    'DELETE',
    async (req: IncomingMessage, res: ServerResponse) => {
      const id = getId(req.url);
      if (!id) {
        throw new BadRequestError();
      }

      if (!isValidUUID(id)) {
        throw new InvalidUserIdError();
      }

      await UsersRepository.delete(id);
      res.writeHead(204);
      res.end();
    },
  ],
]);

const UsersController = {
  async handle(req: IncomingMessage, res: ServerResponse) {
    const method = req.method || '';
    const handler = methodHandlers.get(method);
    if (!handler) {
      throw new BadRequestError();
    }

    await handler(req, res);
  },
};

export default UsersController;
