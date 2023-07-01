import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ServerError } from '../utils/ServerError';

import routes from './routes';

export class Server {

  private instance: express.Application;

  public constructor(
    public configuration: { [key: string]: any }
  ) {

  }

  public async init() {
    if (!this.instance) {
      this.instance = express();
    }

    this.instance.use(cors())
    this.instance.use(express.json())
    this.instance.use(morgan('dev'))

    this.instance.use('/', routes);

    this.instance.use('/', (req, res, next) => {
      next(new ServerError(404, 'Not found'));
    });

    this.instance.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(error?.code ?? 500).json({
        error: error.message
      });
    });

    this.start();
  }

  public async start() {
    if (!this.instance) {
      throw new Error('Server not initialized');
    }

    this.instance.listen(this.configuration.port, () => {
      console.log(`[Server] Listening on port ${this.configuration.port}`);
    });
    console.log(`[Server] Bot initialized`);
  }
}