"use strict";
const Segment = require("./Segment");

class Mesh {
  constructor(segments = null) {
    this.segIdMap = new Map();
    if (segments) {
      for (let segment of segments) {
        if (!this.segIdMap.has(segment.Id)) {
          this.segIdMap.set(segment.Id, segment);
        }
      }
    }
  }

  //Needs to be tested
  addSegment(startCoord, endCoord) {
    const id = Segment.IdFromCoord(startCoord, endCoord);
    if (!this.segIdMap.has(id)) {
      const newSeg = new Segment(startCoord, endCoord);
      for (let seg of this.segIdMap.values()) {
        if (newSeg.contains(seg)) {
          newSeg.contain.push(seg);
        } else if (seg.contains(newSeg)) {
          seg.contain.push(newSeg);
        }
      }
      this.segIdMap.set(id, newSeg);
      return newSeg;
    }
    return this.segIdMap.get(id);
  }

  addSegments(segments) {
    const segs = [];
    for (let segment of segments) {
      segs.push(this.addSegment(segment));
    }
    return segs;
  }
}

module.exports = Mesh;
