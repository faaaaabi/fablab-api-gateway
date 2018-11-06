import * as express from "express";
import * as bodyParser from "body-parser";

class App {

    constructor() {
        this.app = express();
        this.config();
    }

    public app: express.Application;

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded( {extended: false} ))
    }

}

export default new App().app