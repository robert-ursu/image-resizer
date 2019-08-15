import { Response, Request, Router } from 'express';
import ImageSize from '../models/image-size';
import * as ImageService from '../util/image-service';

class ImageController {
    public router: Router = Router();

    public constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/image/:name', this.get);
    }

    public get = async (req: Request, res: Response): Promise<Response> => {
        const imageName = req.params.name.toString(),
            imageSize = req.query.size || '',
            imageType = imageName.split('.').pop();

        if (!this.imageTypeIsSupported(imageType))
            return res.status(400).send('Unsupported image type.');

        const sizes = new ImageSize(imageSize);

        try {
            const imageStream = await ImageService.get(imageName, sizes.width, sizes.height);
            if (imageStream != null) {
                res.type(`image/${imageType}`).status(200);
                return imageStream.pipe(res);
            } else {
                return res.status(404).send('Image not found');
            }
        } catch (error) {
            return res.status(500).send('Something went wrong. Try again!');
        }
    };

    private imageTypeIsSupported(imageType: string): boolean {
        return /(?:jpg|gif|png|jpeg)$/g.test(imageType);
    }
}

export default new ImageController();