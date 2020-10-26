import express from 'express';
import http from 'http';
import {AddressInfo} from 'net';
import ResponseHandlersMiddleware from './middlewares/responseHandlersMiddleware';
import {IError} from './errors/IError';
import NotFoundError from './errors/NotFoundError';
import InventoryRouter from './routes/inventory';
import bodyParser from 'body-parser';

export default class HttpServer {
  public port: string;
  public app: express.Application;

  constructor(port: string) {
    this.port = port;
    this.app = express();
  }

  public init() {
    // extending response object with 'success and error' handlers
    this.app.use(ResponseHandlersMiddleware.add());

    this.app.use(bodyParser.json());

    this.app.get('/', (req: express.Request, res: express.Response) => {
      (res as any).success('Microservice App');
    });

    // inventory routes
    this.app.use('/inventory', InventoryRouter);

    // not found routes handler
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      next(new NotFoundError('Route not found'));
    });

    // generic errors handler 
    this.app.use((err: IError, req: express.Request, res: express.Response, next: express.NextFunction) => {
      (res as any).error(err);
    });

    // create server
    const server = http.createServer(this.app).listen(this.port, () => {
      console.log(
        'Microservice running in http://%s:%s',
        (server.address() as AddressInfo).address,
        (server.address() as AddressInfo).port
      );
    });
  }
}
