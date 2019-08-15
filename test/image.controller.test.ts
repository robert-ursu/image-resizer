/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../src/util/image-service');

import * as imageService from '../src/util/image-service';

const mockImageService = imageService as any;

const mockRequest = (name: string): any => {
    return {
        params: { name: name },
        query: { size: '' }
    };
};

const mockResponse = (): any => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.type = jest.fn().mockReturnValue(res);
    res.on = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    res.once = jest.fn().mockReturnValue(res);
    res.emit = jest.fn().mockReturnValue(res);
    return res;
};

import sut from '../src/controllers/image.controller';

beforeEach((): void => {
    mockImageService.get.mockReset();
});

describe('/image/:image endpoint', (): void => {
    it('should return 400 when the image type is not supported', async (): Promise<void> => {
        const req = mockRequest('not-an-image.json');
        const res = mockResponse();

        await sut.get(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 when image does not exist', async (): Promise<void> => {
        mockImageService.get.mockResolvedValue(null);
        const req = mockRequest('non-existing-image.jpg');
        const res = mockResponse();

        await sut.get(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 200 when image does exist', async (): Promise<void> => {
        const mockImage = { pipe: jest.fn() };
        mockImageService.get.mockResolvedValue(mockImage);
        const req = mockRequest('test-image.jpg');
        const res = mockResponse();

        await sut.get(req, res);

        expect(res.type).toHaveBeenCalledWith('image/jpg');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(mockImage.pipe).toHaveBeenCalled();
    });

    it('should return 500 when something goes wrong server side', async (): Promise<void> => {
        mockImageService.get.mockImplementation(() => { throw Error(); });
        const req = mockRequest('error-image.jpg');
        const res = mockResponse();

        await sut.get(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});