"use strict";
const { createCanvas } = require("canvas");
const fs = require("fs").promises;
const constants = require("./Constants");

class Visualizer {
  static trails = [];
  static grid = {
    width: constants.gridSize.width,
    height: constants.gridSize.height,
  };
  static padding = 100;
  static canvasWidth = Visualizer.grid.width * 80 + Visualizer.padding * 2;
  static canvasHeight = Visualizer.grid.height * 80 + Visualizer.padding * 2;
  static canvas = createCanvas(Visualizer.canvasWidth, Visualizer.canvasHeight);
  static ctx = Visualizer.canvas.getContext("2d");
  static nodes = [];
  static coordWidth = constants.gridSize.width;
  static coordHeight = constants.gridSize.height;
  static cellWidth =
    (Visualizer.canvasWidth - Visualizer.padding * 2) / Visualizer.coordWidth;
  static cellHeight =
    (Visualizer.canvasHeight - Visualizer.padding * 2) / Visualizer.coordHeight;

  static setTrails(trails) {
    Visualizer.trails = trails;
  }

  static setNodes(nodes) {
    Visualizer.nodes = nodes;
  }

  static setProperties(trails, nodes) {
    Visualizer.trails = trails;
    Visualizer.nodes = nodes;
  }

  static setupGrid() {
    Visualizer.ctx.fillStyle = "black";
    Visualizer.ctx.fillRect(
      0,
      0,
      Visualizer.canvasWidth,
      Visualizer.canvasHeight,
    );
    Visualizer.ctx.strokeStyle = "lightgrey";
    Visualizer.ctx.lineWidth = 0.5;

    for (let i = 0; i <= Visualizer.coordWidth; i++) {
      const x = Visualizer.padding + i * Visualizer.cellWidth;
      Visualizer.ctx.beginPath();
      Visualizer.ctx.moveTo(x, Visualizer.padding);
      Visualizer.ctx.lineTo(x, Visualizer.canvasHeight - Visualizer.padding);
      Visualizer.ctx.stroke();
    }
    for (let i = 0; i <= Visualizer.coordHeight; i++) {
      const y = Visualizer.padding + i * Visualizer.cellHeight;
      Visualizer.ctx.beginPath();
      Visualizer.ctx.moveTo(Visualizer.padding, y);
      Visualizer.ctx.lineTo(Visualizer.canvasWidth - Visualizer.padding, y);
      Visualizer.ctx.stroke();
    }

    Visualizer.ctx.fillStyle = "lightgrey";
    Visualizer.ctx.font = "20px Arial";
    Visualizer.ctx.textAlign = "center";
    Visualizer.ctx.textBaseline = "middle";

    for (let i = 0; i <= Visualizer.coordWidth; i++) {
      const x = Visualizer.padding + i * Visualizer.cellWidth;
      Visualizer.ctx.fillText(
        i,
        x,
        Visualizer.canvasHeight - Visualizer.padding + 30,
      );
    }
    Visualizer.ctx.textAlign = "right";
    for (let i = 0; i <= Visualizer.coordHeight; i++) {
      const y = Visualizer.padding + i * Visualizer.cellHeight;
      Visualizer.ctx.fillText(
        i,
        Visualizer.padding - 20,
        Visualizer.canvasHeight - y,
      );
    }
  }

  static drawTrails() {
    Visualizer.ctx.strokeStyle = "white";
    Visualizer.ctx.lineWidth = 2;
    for (let trail of Visualizer.trails) {
      for (let segment of trail.segments) {
        const startX =
          Visualizer.padding + segment.startCoord.x * Visualizer.cellWidth;
        const startY =
          Visualizer.padding +
          (Visualizer.coordHeight - segment.startCoord.y) *
            Visualizer.cellHeight;
        const endX =
          Visualizer.padding + segment.endCoord.x * Visualizer.cellWidth;
        const endY =
          Visualizer.padding +
          (Visualizer.coordHeight - segment.endCoord.y) * Visualizer.cellHeight;
        Visualizer.ctx.beginPath();
        Visualizer.ctx.moveTo(startX, startY);
        Visualizer.ctx.lineTo(endX, endY);
        Visualizer.ctx.stroke();
        Visualizer.drawStartIndicator(startX, startY);
        Visualizer.drawArrowhead(startX, startY, endX, endY);
      }
    }
  }

  static drawArrowhead(fromX, fromY, toX, toY) {
    const headLength = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    Visualizer.ctx.beginPath();
    Visualizer.ctx.moveTo(toX, toY);
    Visualizer.ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6),
    );
    Visualizer.ctx.moveTo(toX, toY);
    Visualizer.ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6),
    );
    Visualizer.ctx.stroke();
  }

  static drawStartIndicator(x, y) {
    const radius = 5;
    Visualizer.ctx.beginPath();
    Visualizer.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    Visualizer.ctx.fillStyle = "white";
    Visualizer.ctx.fill();
  }

  static async updateNode(x, y, color, mapName) {
    const nodeColor = Visualizer.getNodeColor(color);
    Visualizer.ctx.fillStyle = nodeColor;
    Visualizer.ctx.beginPath();
    const x1 = Visualizer.padding + x * Visualizer.cellWidth;
    const y1 =
      Visualizer.padding + (Visualizer.coordHeight - y) * Visualizer.cellHeight;
    Visualizer.ctx.arc(x1, y1, 5, 0, 2 * Math.PI);
    Visualizer.ctx.fill();

    const buffer = Visualizer.canvas.toBuffer("image/png");
    if (mapName) {
      try {
        await fs.access(`./output/${mapName}`, { recursive: true });
      } catch (error) {
        await fs.mkdir(`./output/${mapName}`, { recursive: true });
      }
      await fs.writeFile(`./output/${mapName}/traversed.png`, buffer);
    } else {
      await fs.writeFile(`./output/traversed.png`, buffer);
    }
  }

  static drawNodes(locations, numTraversedNodes) {
    const nodeColor = Visualizer.getNodeColor(numTraversedNodes);
    Visualizer.ctx.fillStyle = nodeColor;
    for (let location of locations) {
      const x = Visualizer.padding + location.x * Visualizer.cellWidth;
      const y =
        Visualizer.padding +
        (Visualizer.coordHeight - location.y) * Visualizer.cellHeight;
      Visualizer.ctx.beginPath();
      Visualizer.ctx.arc(x, y, 5, 0, 2 * Math.PI);
      Visualizer.ctx.fill();
    }
  }

  static getNodeColor(index) {
    let color = constants.Colors;
    return color[index % color.length];
  }

  static async visualizeStaticNode(nodes) {
    try {
      await fs.access("./output", { recursive: true });
    } catch (error) {
      await fs.mkdir("./output", { recursive: true });
    }
    try {
      await fs.access("./output/static", { recursive: true });
    } catch (error) {}
    await fs.mkdir("./output", { recursive: true });
    Visualizer.setupGrid();
    Visualizer.ctx.fillStyle = "red";
    for (let node of nodes) {
      const location = node.location;
      const x = Visualizer.padding + location.x * Visualizer.cellWidth;
      const y =
        Visualizer.padding +
        (Visualizer.coordHeight - location.y) * Visualizer.cellHeight;
      Visualizer.ctx.beginPath();
      Visualizer.ctx.arc(x, y, 5, 0, 2 * Math.PI);
      Visualizer.ctx.fill();
    }
    const buffer = Visualizer.canvas.toBuffer("image/png");
    await fs.writeFile(`./output/static/NodeDistribution.png`, buffer);
  }

  static async visualizeMap(simulator) {
    Visualizer.setTrails(simulator.trailFactory.getAllTrails());
    Visualizer.setupGrid();
    Visualizer.drawTrails();
    const buffer = Visualizer.canvas.toBuffer("image/png");
    try {
      await fs.access("./output", { recursive: true });
    } catch (error) {
      await fs.mkdir("./output", { recursive: true });
    }
    if (simulator.mapName) {
      try {
        await fs.access(`./output/${simulator.mapName}`, { recursive: true });
      } catch (error) {
        await fs.mkdir(`./output/${simulator.mapName}`, { recursive: true });
      }
      await fs.writeFile(
        `./output/${simulator.mapName}/${simulator.mapName}.png`,
        buffer,
      );
    } else {
      await fs.writeFile(`./output/Map_${Date.now()}.png`, buffer);
    }
  }

  static async start(simulator) {
    Visualizer.setTrails(simulator.trailFactory.getAllTrails());
    Visualizer.setupGrid();
    Visualizer.drawTrails();
    Visualizer.visualizeMap(simulator);
    const buffer = Visualizer.canvas.toBuffer("image/png");
    if (simulator.mapName) {
      try {
        await fs.access(`./output/${simulator.mapName}`, { recursive: true });
      } catch (error) {
        await fs.mkdir(`./output/${simulator.mapName}`, { recursive: true });
      }
      await fs.writeFile(`./output/${simulator.mapName}/traversed.png`, buffer);
    } else {
      await fs.writeFile(`./output/traversed.png`, buffer);
    }
  }
}
module.exports = Visualizer;
