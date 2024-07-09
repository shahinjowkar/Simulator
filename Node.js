"Use strict";
const Mesh = require("./Mesh");
const fs = require("fs").promises;
const Visualizer = require("./Visualizer");
const constants = require("./Constants");
class Node {
  static grid = {
    width: constants.gridSize.width,
    height: constants.gridSize.height,
  };

  constructor(velocity, nodeId, mapName) {
    this.velocity = velocity;
    this.location = { x: 0, y: 0 };
    this.publushedLocations = [];
    this.nodeId = nodeId;
    this.mapName = mapName;
  }

  setLocation(coord) {
    const xCoordRound = Number(coord.x.toFixed(3));
    const yCoordRound = Number(coord.y.toFixed(3));
    this.location = { x: xCoordRound, y: yCoordRound };
  }

  static getNormalizedDirectionVector(segment) {
    const dx = segment.endCoord.x - segment.startCoord.x;
    const dy = segment.endCoord.y - segment.startCoord.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    return { dx: dx / length, dy: dy / length };
  }

  static getLength(startCoord, endCoord) {
    const dx = endCoord.x - startCoord.x;
    const dy = endCoord.y - startCoord.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  async publishStatic() {
    try {
      await fs.access("./output/static", { recursive: true });
    } catch (error) {
      await fs.mkdir("./output/static", { recursive: true });
    }
    try {
      await fs.access(`./output/static/locations_${this.nodeId}.csv`);
    } catch (error) {}

    while (true) {
      const promise = new Promise((resolve) =>
        setTimeout(resolve, constants.publishInterval),
      );
      await fs.appendFile(
        `./output/static/locations_${this.nodeId}.csv`,
        `${this.nodeId},${this.location.x},${this.location.y},${Date.now()}\n`,
      );
      await promise;
    }
  }

  async publishLocation(normalizedDirectionVector, trailID) {
    const getPerpendicularVector = {
      dx: -normalizedDirectionVector.dy,
      dy: normalizedDirectionVector.dx,
    };
    const turbulence = Math.random() / 4 - 0.1;
    const xTurbulence = getPerpendicularVector.dx * turbulence;
    const yTurbulence = getPerpendicularVector.dy * turbulence;
    let x =
      this.location.x + xTurbulence < 0 ||
      this.location.x + xTurbulence > Node.grid.width
        ? this.location.x - xTurbulence < 0 ||
          this.location.x - xTurbulence > Node.grid.width
          ? this.location.x
          : this.location.x - xTurbulence
        : this.location.x + xTurbulence;

    let y =
      this.location.y + yTurbulence < 0 ||
      this.location.y + yTurbulence > Node.grid.height
        ? this.location.y - yTurbulence < 0 ||
          this.location.y - yTurbulence > Node.grid.height
          ? this.location.y
          : this.location.y - yTurbulence
        : this.location.y + yTurbulence;

    x = x.toFixed(3);
    y = y.toFixed(3);
    this.publushedLocations.push({ x: x, y: y });
    try {
      await fs.access("./output", { recursive: true });
    } catch (error) {
      await fs.mkdir("./output", { recursive: true });
    }
    if (this.mapName) {
      try {
        await fs.access(`./output/${this.mapName}`, { recursive: true });
      } catch (error) {
        await fs.mkdir(`./output/${this.mapName}`, { recursive: true });
      }
    }
    if (this.mapName) {
      await fs.appendFile(
        `./output/${this.mapName}/locations_${this.nodeId}.csv`,
        `${this.nodeId},${x},${y},${Date.now()},${trailID},${this.velocity}\n`,
      );
    } else {
      await fs.appendFile(
        `./output/locations_${this.nodeId}.csv`,
        `${this.nodeId},${x},${y},${Date.now()},${trailID}\n`,
      );
    }
  }

  async traverseSeg(segment, ToCatchUp, trailID) {
    let distanceCovered = ToCatchUp;
    const normalizedDirectionVector =
      Node.getNormalizedDirectionVector(segment);
    const segLength = Node.getLength(segment.startCoord, segment.endCoord);
    this.setLocation(segment.startCoord);
    const startingXcoord =
      normalizedDirectionVector.dx * ToCatchUp + this.location.x;
    const startingYcoord =
      normalizedDirectionVector.dy * ToCatchUp + this.location.y;
    this.setLocation({ x: startingXcoord, y: startingYcoord });
    while (distanceCovered <= segLength) {
      const promise = new Promise((resolve) =>
        setTimeout(resolve, constants.publishInterval),
      );
      await this.publishLocation(normalizedDirectionVector, trailID);
      const x = normalizedDirectionVector.dx * this.velocity + this.location.x;
      const y = normalizedDirectionVector.dy * this.velocity + this.location.y;
      const distanceTraveled = Node.getLength(this.location, { x: x, y: y });
      this.setLocation({ x: x, y: y });
      distanceCovered = distanceCovered + distanceTraveled;
      await promise;
    }
    return distanceCovered - segLength;
  }

  async traverse(trail, numTraversedNodes) {
    let toCatchUp = 0;
    const segments = trail.segments;

    for (let segment of segments) {
      toCatchUp = await this.traverseSeg(segment, toCatchUp, trail.id);
    }
    Visualizer.drawNodes(this.publushedLocations, numTraversedNodes - 1);
    const buffer = Visualizer.canvas.toBuffer("image/png");
    await fs.writeFile(`./output/${this.mapName}/traversed.png`, buffer);
  }
}

module.exports = Node;
