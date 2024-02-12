import { IncomingMessage, ServerResponse } from 'node:http';
import { isValidUUID, isValidUserData, getRequestBody } from '../utils/index.ts';
import { UsersRepository, UserModel } from '../repositories/users.ts';

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
          throw new Error('Invalid user id');
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
        throw new Error('Bad request.');
      }

      const body = await getRequestBody(req);
      if (!isValidUserData(body)) {
        throw new Error('Incorrect user data');
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
        throw new Error('Bad request.');
      }

      if (!isValidUUID(id)) {
        throw new Error('Invalid user id');
      }

      const body = await getRequestBody(req);
      if (!isValidUserData(body)) {
        throw new Error('Incorrect user data.');
      }

      const { username, age, hobbies } = body as Omit<UserModel, 'id'>;
      const user = await UsersRepository.update(id, { username, age, hobbies });
      res.writeHead(201);
      res.end(JSON.stringify(user));
    },
  ],
]);

const UsersController = {
  async handle(req: IncomingMessage, res: ServerResponse) {
    const method = req.method || '';
    const handler = methodHandlers.get(method);
    if (handler) {
      await handler(req, res);
    } else {
      res.writeHead(400);
      res.end('Bad request.');
    }
  },
};

export default UsersController;
