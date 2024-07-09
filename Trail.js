"use strict";

const Segment = require("./Segment");
// const Mesh = require("./Mesh")

class Trail {
  static ID = 1;
  constructor(segments, flowRate) {
    if (!Segment.isConnectedAll(segments)) {
      throw Error("INVALID TRAIL, segments should be connected");
    }
    if (!segments[0].isValidStartingSeg()) {
      throw Error(
        "INVALID TRAIL, Trail has to start on the boundries of the blcok",
      );
    }
    if (!segments[segments.length - 1].isValidEndingSeg()) {
      throw Error(
        "INVALID TRAIL, Trail has to end on the boundries of the blcok",
      );
    }
    this.segments = segments;
    this.id = Trail.ID;
    this.flowRate = flowRate;
    Trail.ID++;
  }
}
module.exports = Trail;
