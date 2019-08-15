import { Response, Request, Router } from 'express';
import * as StatsService from '../util/stats-service';

class StatsController {
    public router: Router = Router();

    public constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/stats', this.get);
    }

    public get = async (req: Request, res: Response): Promise<Response> => {
        return res.json(await StatsService.getStats());
    }
}

export default new StatsController();