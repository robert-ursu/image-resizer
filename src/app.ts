import { apiPort } from './config';

import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';

// controllers
import ImageController from './controllers/image.controller';
import StatsController from './controllers/stats.controller';

export default class App {
    private app: express.Application;
    private port: number = apiPort;

    public constructor() {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeControllers();
    }

    private initializeMiddlewares(): void {
        this.app.use(errorHandler());
        this.app.use(compression());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private initializeControllers(): void {
        this.app.use('/', ImageController.router);
        this.app.use('/', StatsController.router);
    }

    public start(): void {
        this.app.listen(this.port, (): void => {
            console.log(`App is running at http://localhost:${this.port}`);
        });
    }
}