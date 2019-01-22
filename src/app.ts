import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

class App {

  constructor() {
    this.app = express();
    this.config();
  }

  public app: express.Application;

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(morgan('combined'));
  }
}
export default new App().app;
