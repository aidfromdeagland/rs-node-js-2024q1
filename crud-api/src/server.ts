import 'dotenv/config';
import http, { IncomingMessage, ServerResponse } from 'node:http';
import UsersController from './controllers/users.ts';

type Controller = {
  handle: (req: IncomingMessage, res: ServerResponse) => Promise<unknown>;
};

const { PORT = 4000 } = process.env;
const controllers: {
  [key: string]: Controller;
} = {
  users: UsersController,
};
console.log(`port for server: ${PORT}`);

http
  .createServer(async (req, res) => {
    res.setHeader('Content-Type', 'json');
    const url = req.url || '';
    const [apiPrefix, controllerPath] = url.split('/').filter((route) => !!route);

    if (apiPrefix !== 'api' || !controllers[controllerPath]) {
      res.writeHead(400);
      res.end('Bad request.');
      return;
    }

    const controller = controllers[controllerPath];
    await controller.handle(req, res);
  })
  .listen(PORT);
