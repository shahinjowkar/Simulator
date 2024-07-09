"use strict";
const Node = require("./Node");
const Mesh = require("./Mesh");
const Visualizer = require("./Visualizer");
const TrailFactory = require("./TrailFactory");
const constants = require("./Constants");

class Simulator {
  constructor(Mesh, trailFactory) {
    this.Mesh = Mesh;
    this.mapName;
    this.trailFactory = trailFactory;
  }

  setMapName(name) {
    this.mapName = name;
  }

  async run(trail, interval, tag) {
    let counter = 1;
    while (true) {
      const speed = Math.floor(Math.random() * 5) + 1;
      const node = new Node(speed, `${Date.now()}_${tag}`, this.mapName);
      const promise = new Promise((resolve) => setTimeout(resolve, interval));
      node.traverse(trail, counter);
      counter++;
      await promise;
    }
  }

  getCoordCentre(topRightCoord, bottomLeftCoord) {
    return {
      x: (topRightCoord.x - bottomLeftCoord.x) / 2 + bottomLeftCoord.x,
      y: (topRightCoord.y - bottomLeftCoord.y) / 2 + bottomLeftCoord.y,
    };
  }

  getDistributedCords(numberOfNodes) {
    const coords = [];
    if (numberOfNodes === 0) {
      return;
    }

    if (numberOfNodes === 1) {
      coords.push(
        this.getCoordCentre(
          { x: 0, y: 0 },
          { x: constants.gridSize.width, y: constants.gridSize.height },
        ),
      );
      return coords;
    }

    const sqrt = Math.ceil(Math.sqrt(numberOfNodes));
    const horizontalSegSize = Math.floor(constants.gridSize.width / sqrt);
    const verticalSegSize = Math.floor(constants.gridSize.height / sqrt);
    for (let i = 0; i < sqrt; i++) {
      for (let j = 0; j < sqrt; j++) {
        const bottomLeftCoord = {
          x: i * horizontalSegSize,
          y: j * verticalSegSize,
        };
        const topRightCoord = {
          x: (i + 1) * horizontalSegSize,
          y: (j + 1) * verticalSegSize,
        };

        coords.push(this.getCoordCentre(topRightCoord, bottomLeftCoord));
      }
    }
    return coords;
  }

  distributeNodes(numberOfNodes) {
    let availableCoords = this.getDistributedCords(numberOfNodes);
    const nodes = [];
    let tag = 1;
    while (tag <= numberOfNodes) {
      const myIndex = Math.floor(Math.random() * availableCoords.length);
      const location = availableCoords[myIndex];
      const myNode = new Node(0, tag);
      myNode.setLocation(location);
      nodes.push(myNode);
      availableCoords = availableCoords.filter((_, index) => index !== myIndex);
      tag++;
    }
    return nodes;
  }

  async runStatic(numberOfNodes) {
    const nodes = this.distributeNodes(numberOfNodes);

    for (let node of nodes) {
      node.publishStatic();
    }
    await Visualizer.visualizeStaticNode(nodes);
  }

  async start() {
    //how to define the flow rate?
    const trails = this.trailFactory.getAllTrails();
    let tag = 0;
    for (let trail of trails) {
      let flowRate = trail?.flowRate ?? 1;
      if (flowRate < 0 || flowRate > 1) {
        throw new Error(
          "INVALID FLOW RATE: the flow rate should be a number between 0 and 1",
        );
      }
      if (flowRate !== 0) {
        this.run(trail, constants.MinNodeInterval / flowRate, tag);
      }
      tag++;
    }
  }

  importMap(filePath) {
    const MapJson = require(filePath);
    this.setMapName(filePath.split("/")[2].split(".")[0]);
    for (let trail of Object.keys(MapJson)) {
      const segments = MapJson[trail].segment.map((entry) =>
        this.Mesh.addSegment(entry.startCoord, entry.endCoord),
      );
      this.trailFactory.setTrail(segments, MapJson[trail].flowRate);
    }
  }
}

(async () => {
  //Use this part if you want to use the traversing mode of the simulator
  /* -------------------------------------------*/
  const mesh = new Mesh();
  const trailFactory = new TrailFactory(mesh);
  const simulator = new Simulator(mesh, trailFactory);
  simulator.importMap("./maps/map9.json")
  await Visualizer.start(simulator);
  await simulator.start();
  /*------------------------------------------- */

  //Use this part if you want to use static mode of the simulator
  /* -------------------------------------------*/
  // const Staticmesh = new Mesh();
  // const simulator = new Simulator(Staticmesh);
  // simulator.runStatic(98);
  /*------------------------------------------- */
})();
