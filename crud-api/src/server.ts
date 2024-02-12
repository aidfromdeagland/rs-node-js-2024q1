import 'dotenv/config';
import http, { IncomingMessage, ServerResponse } from 'node:http';
import UsersController from './controllers/users.ts';
import {
  BadRequestError,
  NoUserError,
  InvalidJSONStructure,
  InvalidUserIdError,
  InvalidUserPayloadError,
  InvalidRouteError,
} from './shared/errors.ts';

type Controller = {
  handle: (req: IncomingMessage, res: ServerResponse) => Promise<unknown>;
};

const { PORT = 4000 } = process.env;
const controllers: {
  [key: string]: Controller;
} = {
  users: UsersController,
};

http
  .createServer(async (req, res) => {
    try {
      res.setHeader('Content-Type', 'json');
      const url = req.url || '';
      const [apiPrefix, controllerPath, _id, redundantPath] = url
        .split('/')
        .filter((route) => !!route);

      const controller = controllers[controllerPath];
      if (!controllers[controllerPath] || apiPrefix !== 'api' || redundantPath) {
        throw new InvalidRouteError();
      }

      await controller.handle(req, res);
    } catch (error) {
      let status: number;
      let message: string;

      if (error instanceof BadRequestError) {
        status = 400;
        message = error.message;
      } else if (error instanceof NoUserError) {
        status = 404;
        message = error.message;
      } else if (error instanceof InvalidUserIdError) {
        status = 400;
        message = error.message;
      } else if (error instanceof InvalidUserPayloadError) {
        status = 400;
        message = error.message;
      } else if (error instanceof InvalidRouteError) {
        status = 404;
        message = error.message;
      } else if (error instanceof InvalidJSONStructure) {
        status = 400;
        message = error.message;
      } else {
        status = 500;
        message = 'Internal server error';
      }

      res.writeHead(status);
      res.end(message);
    }
  })
  .listen(PORT);

console.log(`listening for teh request on port: ${PORT}`);
