class ImageSize {
    public height?: number = null;
    public width?: number = null;

    public constructor(size?: string) {
        if (size != null && this.isSizeValid(size)) {
            this.extractImageSize(size);
        }
    }

    private isSizeValid(size: string): boolean {
        return /^\d+(x|X)\d+$/g.test(size) || /^\s*$/g.test(size);
    }

    private extractImageSize(size: string): void {
        const sizes = size.match(new RegExp(/\d+/g));
        if (sizes != null && sizes.length == 2) {
            this.height = Number(sizes[0]);
            this.width = Number(sizes[1]);
        }
    }
}

export default ImageSize;