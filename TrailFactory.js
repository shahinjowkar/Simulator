"use strict";
const Trail = require("./Trail");
const Segment = require("./Segment");
var crypto = require("crypto");

//usefull for future itterations(KEEP)
class TrailFactory {
  constructor(mesh) {
    this.mesh = mesh;
    this.trailsHashMap = new Map();
  }

  hash(segments) {
    const mashedId = Segment.getMashedIds(segments);
    const key = crypto.createHash("sha1").update(mashedId).digest("hex");
    return key;
  }
  hasTrail(segments) {
    const key = this.hash(segments);
    if (this.trailsHashMap.has(key)) {
      return true;
    }
    return false;
  }

  setTrail(segments, flowRate) {
    for (let segment of segments) {
      if (!this.mesh.segIdMap.has(segment.Id)) {
        throw Error(
          `INVALID TRAIL:${segment.Id} Segment does not exists in the mesh`,
        );
      }
    }
    if (this.hasTrail(segments)) {
      return this.trailsHashMap.get(this.hash(segments));
    }
    const trail = new Trail(segments, flowRate);
    this.trailsHashMap.set(this.hash(segments), trail);
    return trail;
  }

  getAllTrails() {
    const trails = [];
    for (let value of this.trailsHashMap.values()) {
      trails.push(value);
    }
    return trails;
  }
}
module.exports = TrailFactory;
