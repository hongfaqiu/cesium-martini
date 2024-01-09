# Cesium-Martini

**This is a fork from [cesium-martini](https://github.com/davenquinn/cesium-martini)**, click to view details.

This module can create cesium terrain through raster tile service.

![Cesium-Martini](/img/cesium-martini.png)

## Usage

```ts
import { Viewer, Resource } from "cesium";
import { MartiniTerrainProvider } from "@zjugis/cesium-martini";

const cesiumViewer = new Viewer("cesiumContainer");

const terrainLayer = new MartiniTerrainProvider({
  url: new Resource({
    url: 'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}@2x.webp',
    queryParameters: {
      access_token: 'pk.eyJ1Ijoic3ZjLW9rdGEtbWFwYm94LXN0YWZmLWFjY2VzcyIsImEiOiJjbG5sMnFlZ28wb2d5MnFtb2xnMG90OW96In0.IE8Vqs0NTzCY0WqPzV9kcw'
    },
  }),
  requestVertexNormals: true,
});

cesiumViewer.scene.terrainProvider = terrainLayer;
```

## Installation

This package is listed on NPM as `@zjugis/cesium-martini`. It can be installed
using the command

```bash
npm install --save @zjugis/cesium-martini
```

## Demo

[online Demo](https://cesium-martini.opendde.com/)

Launch the app in the demo folder, and then visit <http://localhost:8080/>

![Cesium-Martini](https://s1.ax1x.com/2022/08/09/v1GhtO.png)

```node
pnpm install
pnpm dev
```

## Credit

<https://github.com/davenquinn/cesium-martini>
