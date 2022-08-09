# Cesium-Martini

**This is a fork from [cesium-martini](https://github.com/davenquinn/cesium-martini)**, click to view details.

This module can create cesium terrain through raster tile service.

![Cesium-Martini](/img/cesium-martini.png)

## Usage

```ts
import { Viewer, Resource } from "cesium";
import { MartiniTerrainProvider } from "@dde/cesium-martini";

const cesiumViewer = new Viewer("cesiumContainer");

const terrainLayer = new MartiniTerrainProvider({
  url: new Resource({
    url: 'https://a.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png',
    queryParameters: {
      access_token: 'pk.eyJ1IjoibW91cm5lciIsImEiOiJWWnRiWG1VIn0.j6eccFHpE3Q04XPLI7JxbA'
    }
  }),
  requestVertexNormals: true,
})

cesiumViewer.scene.terrainProvider = terrainLayer;
```

## Installation

This package is listed on NPM as `@zjugis/cesium-martini`. It can be installed
using the command

```bash
yarn add @zjugis/cesium-martini
```

## Demo

[online Demo](https://cesium-martini.vercel.app/)

Launch the app in the demo folder, and then visit <http://localhost:8080/>

![Cesium-Martini](https://s1.ax1x.com/2022/08/09/v1GhtO.png)

```node
pnpm install
npm start
```

## Credit

<https://github.com/davenquinn/cesium-martini>
