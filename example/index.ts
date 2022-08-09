import { Cartesian3, Math as CMath } from 'cesium';
import CesiumMap from './map';

const BaseMap: Layer.LayerItem = {
  layerName: 'esri-global',
  id: 'esri-global',
  method: 'arcgis',
  url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
}

// initialization
const MapObj = new CesiumMap('app')

MapObj.addRasterLayer(BaseMap)

const MapboxTerrain: Layer.TerrainLayer = {
  id: 'mapbox-terrain',
  layerName: 'mapbox-terrain',
  url: 'https://a.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png',
  type: 'martini',
  queryParameters: {
    access_token: 'pk.eyJ1IjoibW91cm5lciIsImEiOiJWWnRiWG1VIn0.j6eccFHpE3Q04XPLI7JxbA'
  }
}
const clat = -21.133786;
const clon = 14.5481193;
const extent = Cartesian3.fromDegrees(clon, clat - 0.3, 8000);
MapObj.viewer.camera.setView({
  destination: extent,
  orientation: {
    heading: CMath.toRadians(0), // east, default value is 0.0 (north)
    pitch: CMath.toRadians(-15), // default value (looking down)
    roll: 0.0, // default value
  },
});

MapObj.addTerrain(MapboxTerrain)