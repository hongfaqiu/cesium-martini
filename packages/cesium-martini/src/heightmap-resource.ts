import { Resource } from "cesium";
import { TileCoordinates } from "./terrain-provider";

export interface HeightmapResource {
  tileSize: number;
  getTilePixels: (coords: TileCoordinates) => Promise<ImageData | undefined>;
  getTileDataAvailable: (coords: TileCoordinates) => boolean;
}

interface CanvasRef {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

export interface DefaultHeightmapResourceOpts {
  url: string | Resource;
  skipOddLevels?: boolean;
  maxZoom?: number;
  tileSize?: number;
}

export class DefaultHeightmapResource implements HeightmapResource {
  resource: Resource;
  tileSize: number = 256;
  maxZoom: number;
  skipOddLevels: boolean = false;
  contextQueue: CanvasRef[];

  constructor(opts: DefaultHeightmapResourceOpts) {
    // @ts-ignore
    this.resource = Resource.createIfNeeded(opts.url);
    this.skipOddLevels = opts.skipOddLevels ?? false;
    this.tileSize = opts.tileSize ?? 256;
    this.maxZoom = opts.maxZoom ?? 15;
    this.contextQueue = [];
  }

  getCanvas() {
    let ctx = this.contextQueue.pop();
    if (ctx == null) {
      const canvas = document.createElement("canvas");
      canvas.width = this.tileSize;
      canvas.height = this.tileSize;
      const context = canvas.getContext("2d");
      if(context)
        ctx = {
          canvas,
          context,
        };
    }
    return ctx;
  }

  getPixels(img: HTMLImageElement | HTMLCanvasElement | ImageBitmap | undefined): ImageData | undefined {
    if (!img) return undefined;
    const canvasRef = this.getCanvas();
    if (!canvasRef) return undefined
    const { context } = canvasRef;
    //context.scale(1, -1);
    // Chrome appears to vertically flip the image for reasons that are unclear
    // We can make it work in Chrome by drawing the image upside-down at this step.
    context.drawImage(img, 0, 0, this.tileSize, this.tileSize);
    const pixels = context.getImageData(0, 0, this.tileSize, this.tileSize);
    context.clearRect(0, 0, this.tileSize, this.tileSize);
    this.contextQueue.push(canvasRef);
    return pixels;
  }

  loadImage(tileCoords: TileCoordinates) {
    // reverseY for TMS tiling (https://gist.github.com/tmcw/4954720)
    // See tiling schemes here: https://www.maptiler.com/google-maps-coordinates-tile-bounds-projection/
    const { z, y } = tileCoords;
    return this.resource
      ?.getDerivedResource({
        templateValues: {
          ...tileCoords,
          reverseY: Math.pow(2, z) - y - 1,
        },
        preserveQueryParameters: true,
      })
      .fetchImage()
  }

  getTilePixels = async (coords: TileCoordinates) => {
    const img = await this.loadImage(coords);
    return this.getPixels(img);
  };

  getTileDataAvailable({ z }: { z: number }) {
    if (z == this.maxZoom) return true;
    if (z % 2 == 1 && this.skipOddLevels) return false;
    if (z > this.maxZoom) return false;
    return true;
  }
}

export default DefaultHeightmapResource;
