import { ArcGisMapServerImageryProvider, Cartesian3, ImageryLayer, Resource, Viewer, Math as CMath } from 'cesium';
import './index.css';
import { MartiniTerrainProvider } from "@zjugis/cesium-martini";

const viewer = new Viewer('cesiumContainer', {
  baseLayer: ImageryLayer.fromProviderAsync(ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', {
    enablePickFeatures: false
  }), {}),
  baseLayerPicker: false,
  animation: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  selectionIndicator: true,
  timeline: false,
  navigationHelpButton: false,
  shouldAnimate: true,
  useBrowserRecommendedResolution: false,
  orderIndependentTranslucency: false,
});

const terrainLayer = new MartiniTerrainProvider({
  url: new Resource({
    url: 'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}@2x.webp',
    queryParameters: {
      access_token: 'pk.eyJ1Ijoic3ZjLW9rdGEtbWFwYm94LXN0YWZmLWFjY2VzcyIsImEiOiJjbG5sMnFlZ28wb2d5MnFtb2xnMG90OW96In0.IE8Vqs0NTzCY0WqPzV9kcw'
    },
  }),
  requestVertexNormals: true,
});

viewer.scene.terrainProvider = terrainLayer;

const extent = Cartesian3.fromDegrees(14.5481193, -21.433786, 8000);
viewer.camera.setView({
  destination: extent,
  orientation: {
    heading: CMath.toRadians(0), 
    pitch: CMath.toRadians(-15),
    roll: 0.0,
  },
});