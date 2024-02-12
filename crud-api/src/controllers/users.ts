import { IncomingMessage, ServerResponse } from 'node:http';
import { UsersRepository } from '../repositories/users.ts';

const uuidRegexp =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

const validateId = (id) => {
  if (!uuidRegexp.test(id)) {
    throw new Error('id is incorrect');
  }
};

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
        validateId(id);
        const user = await UsersRepository.getById(id);
        res.writeHead(200);
        res.end(JSON.stringify(user));
      }

      const users = await UsersRepository.getAll();
      res.writeHead(200);
      res.end(JSON.stringify(users));
    },
  ],
]);

const UsersController = {
  async handle(req: IncomingMessage, res: ServerResponse) {
    const method = req.method || '';
    const handler = methodHandlers.get(method);
    if (handler) {
      handler(req, res);
    } else {
      res.writeHead(400);
      res.end('unsupported method');
    }
  },
};

export default UsersController;
