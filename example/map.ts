import { ArcGisMapServerImageryProvider, Cartesian3, CesiumTerrainProvider, createWorldTerrain, EllipsoidTerrainProvider, GeographicTilingScheme, ImageryProvider, Resource, Viewer, WebMercatorTilingScheme } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { MartiniTerrainProvider } from "../lib";
import { Layer } from './typing';

/**
 * CesiumMap类
 */
export default class CesiumMap {
  readonly viewer: Viewer;
  readonly cesiumContainer: string;

  constructor(cesiumContainer: string) {
    this.viewer = this.initMap(cesiumContainer);
    this.cesiumContainer = cesiumContainer;
  }

  /**
   * 初始化地图
   * @param cesiumContainer 地图容器div id
   */
  protected initMap = (cesiumContainer: string) => {
    const viewer = new Viewer(cesiumContainer, {
      baseLayerPicker: false, // 图层选择器
      animation: false, // 左下角仪表
      fullscreenButton: false, // 全屏按钮
      geocoder: false, // 右上角查询搜索
      infoBox: false, // 信息框
      homeButton: false, // home按钮
      selectionIndicator: false, //
      timeline: false, // 时间轴
      navigationHelpButton: false, // 右上角帮助按钮
      shouldAnimate: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity, // 静止时不刷新,减少系统消耗
      useBrowserRecommendedResolution: false,
    });

    // viewer.scene.globe.enableLighting = true;
    viewer.scene.fog.density = 0.0001; // 雾气中水分含量
    viewer.scene.globe.enableLighting = false;
    viewer.scene.moon.show = false; // 不显示月球
    // @ts-ignore
    viewer._cesiumWidget._creditContainer.style.display = 'none';
    viewer.scene.skyBox.show = false;
    // @ts-ignore
    viewer.imageryLayers.remove(viewer.imageryLayers._layers[0]);

    return viewer;
  };

  zoomToViewPort(viewPort: number[] | undefined) {
    if (viewPort) {
      this.viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(viewPort[0], viewPort[1], viewPort[2]),
        duration: 1,
      });
      return true;
    }
    return false;
  }

  protected getResource(options: {
    url: string;
    headers?: any;
    queryParameters?: any;
  }) {
    return new Resource({
      ...options,
      retryAttempts: 1,
    });
  }

  /**
   * 添加栅格图层
   * @param {Layer.LayerItem} imageLayer 栅格图层参数
   * @param {number} [options.index] the index to add the layer at. If omitted, the layer will added on top of all existing layers.
   * @param {boolean} [options.zoom] 是否缩放,默认为false
   * @returns ImageryLayer
   */
  async addRasterLayer(
    imageLayer: Layer.LayerItem,
    options: {
      index?: number;
      zoom?: boolean;
    } = {},
  ) {
    if (!imageLayer.url) return null;
    const { viewPort } = imageLayer;
    const { index, zoom } = options;
    const imageryProvider = await this.generateImageProvider(imageLayer);
    if (!imageryProvider) return null;
    const layer = this.viewer.imageryLayers.addImageryProvider(imageryProvider, index);

    if (zoom) {
      this.zoomToViewPort(viewPort);
    }
    this.viewer.scene.requestRender();
    return layer;
  }

  /**
   * generate ImageProvider Object
   * @param {Layer.LayerItem} imageLayer
   * @returns {Promise<ImageryProvider | null>} ImageProvider
   */
  protected async generateImageProvider(imageLayer: Layer.LayerItem): Promise<ImageryProvider | null> {
    const { url: OriginUrl, method, layerName, headers, queryParameters } = imageLayer;
    const { loaderinfo = {} } = imageLayer as Layer.RasterLayerItem;
    const { minimumLevel = 1, maximumLevel = 18 } = loaderinfo;

    const layer = imageLayer.sourceLayer || layerName;
    const tilingScheme4326 = new GeographicTilingScheme();
    const tilingScheme3857 = new WebMercatorTilingScheme();
    const tilingScheme = (loaderinfo?.srs ?? '').indexOf('4326') !== -1 ? tilingScheme4326 : tilingScheme3857;

    const url: any = typeof OriginUrl === 'string' ? this.getResource({
      url: OriginUrl,
      headers,
      queryParameters
    }) : OriginUrl;

    let imageryProvider: any = null;

    switch (method) {
      case 'arcgis':
        imageryProvider = new ArcGisMapServerImageryProvider({
          url,
          maximumLevel,
        });
        break;
      default:
        break;
    }
    return imageryProvider;
  }

  addTerrain(layer: Layer.TerrainLayer) {
    const { type, headers, queryParameters, options } = layer;
    let terrainLayer: CesiumTerrainProvider | EllipsoidTerrainProvider | MartiniTerrainProvider = new EllipsoidTerrainProvider({});
    switch (type) {
      case 'cesium':
        terrainLayer = createWorldTerrain({
          requestVertexNormals: true,
          ...options,
        });
        break;
      case 'custom':
        terrainLayer = new CesiumTerrainProvider({
          url: this.getResource({
            url: layer.url,
            headers,
            queryParameters,
          }),
          requestVertexNormals: true,
        });
        break;
      case 'martini':
        terrainLayer = new MartiniTerrainProvider({
          url: this.getResource({
            url: layer.url,
            headers,
            queryParameters,
          }),
          requestVertexNormals: true,
        });
        break;
      default:
        break;
    }
    
    this.viewer.scene.terrainProvider = terrainLayer as any;
    this.viewer.scene.requestRender();
  }
}
