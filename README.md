# image-resizer

A microservice which resizes images.

---

## Install

    $ git clone https://github.com/robert-ursu/image-resizer.git
    $ cd image-resizer
    $ npm install

## Configure app

Set `API_PORT` environment variable to set the port for the app. It defaults to `3000`.

## Adding images

Copy the images in the `images` directory inside the `dist` directory. For docker containers you can mount `/app/images` to the host or you can drop your images there by other means. I included some images of my cat in the `seed-images` to use while testing the service.

## Running the project

    $ npm run build
    $ npm run serve

## Running in debug

    $ npm run debug

## Running in docker

In order to run the service inside a docker container you first have to build an image out of the `Dockerfile` provided.

    $ npm run build
    $ docker build -t <insert-image-tag-here> .
    $ docker run --rm -d -p 3000:3000 --name image-resizer <insert-image-tag-here>

Aditionally you can add the `-v` flag to mount to an host directory for easy images drop.

    $ docker run --rm -d -p 3000:3000 -v ~/Desktop/images:/app/images --name image-resizer <insert-image-tag-here>

## Running tests

    $ npm run test

## Usage example

Start the service and the exposed endpoints are `http://localhost:3000/image/:image-name?size=widthxheight` and `http://localhost:300/stats`. Drop the images (you can use example images from `seed-images`) in `dist/images` or in the mounted folder.

```
curl http://localhost:3000/stats
```

```
curl http://localhost:3000/image/img-01.jpg
```

```
curl http://localhost:3000/image/img-01.jpg?size=700x700
```