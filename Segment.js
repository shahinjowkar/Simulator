"use strict";
const constants = require("./Constants");

class Segment {
  static boundry = {
    width: constants.gridSize.width,
    height: constants.gridSize.height,
  };

  static minLength = constants.minLength;
  constructor(startCoord, endCoord) {
    if (
      startCoord.x < 0 ||
      startCoord.x > Segment.boundry.width ||
      startCoord.y < 0 ||
      startCoord.y > Segment.boundry.height
    ) {
      throw Error(
        `Segment Can't start outside of the boundry [ (0,0) , (${Segment.boundry.width}, ${Segment.boundry.height}) ]`,
      );
    }
    if (
      endCoord.x < 0 ||
      endCoord.x > Segment.boundry.width ||
      endCoord.y < 0 ||
      endCoord.y > Segment.boundry.height
    ) {
      throw Error(
        `Segment Can't end outside of the boundry [ (0,0) , (${Segment.boundry.width}, ${Segment.boundry.height}) ]`,
      );
    }
    if (
      Math.sqrt(
        (endCoord.x - startCoord.x) ** 2 + (endCoord.y - startCoord.y) ** 2,
      ) < Segment.minLength
    ) {
      throw Error(`Segment Can't be shorter than ${Segment.minLength}`);
    }
    this.startCoord = startCoord;
    this.endCoord = endCoord;
    this.contain = [];
    this.Id = `SEG_${startCoord.x}.${startCoord.y}_${endCoord.x}.${endCoord.x}`;
  }
  static IdFromCoord(startCoord, endCoord) {
    return `SEG_${startCoord.x}.${startCoord.y}_${endCoord.x}.${endCoord.x}`;
  }

  static getMashedIds(segments) {
    let MashedId = "";
    for (let segment of segments) {
      MashedId = MashedId + segment.Id;
    }
    return MashedId;
  }

  static isEqualCoord(coord1, coord2) {
    if (coord1.x === coord2.x && coord1.y === coord2.y) {
      return true;
    }
    return false;
  }

  isEqual(segment) {
    if (this.Id === segment.Id) {
      return true;
    }
    return false;
  }

  static isOnUpperEdge(coords) {
    if (coords.x <= Segment.boundry.width && coords.x >= 0 && coords.y === 0) {
      return true;
    }

    return false;
  }

  static isOnLowerEdge(coords) {
    if (
      coords.x >= 0 &&
      coords.x <= Segment.boundry.width &&
      coords.y === Segment.boundry.height
    ) {
      return true;
    }

    return false;
  }

  static isOnLeftedge(coords) {
    if (coords.x === 0 && coords.y >= 0 && coords.y <= Segment.boundry.height) {
      return true;
    }

    return false;
  }

  static isOnRightendge(coords) {
    if (
      coords.x === Segment.boundry.width &&
      coords.y >= 0 &&
      coords.y <= Segment.boundry.height
    ) {
      return true;
    }

    return false;
  }

  isValidStartingSeg() {
    if (
      Segment.isOnUpperEdge(this.startCoord) ||
      Segment.isOnLowerEdge(this.startCoord) ||
      Segment.isOnRightendge(this.startCoord) ||
      Segment.isOnLeftedge(this.startCoord)
    ) {
      return true;
    }

    return false;
  }

  isValidEndingSeg() {
    if (
      Segment.isOnUpperEdge(this.endCoord) ||
      Segment.isOnLowerEdge(this.endCoord) ||
      Segment.isOnRightendge(this.endCoord) ||
      Segment.isOnLeftedge(this.endCoord)
    ) {
      return true;
    }

    return false;
  }

  isConnected(segment) {
    if (Segment.isEqualCoord(this.endCoord, segment.startCoord)) {
      return true;
    }

    return false;
  }

  static isConnectedAll(segments) {
    if (segments.length === 0) {
      throw new Error("Segments list can't be empty");
    }
    for (let i = 0; i < segments.length; i++) {
      if (i === segments.length - 1) {
        return true;
      } else {
        if (!segments[i].isConnected(segments[i + 1])) {
          return false;
        }
      }
    }
  }

  getSlope() {
    return this.endCoord.x - this.startCoord.x === 0
      ? Infinity
      : (this.endCoord.y - this.startCoord.y) /
          (this.endCoord.x - this.startCoord.x);
  }
  //needs to be tested
  contains(segment) {
    if (this.getSlope() === segment.getSlope()) {
      const xDir = Math.sign(this.endCoord.x - this.startCoord.x);
      const yDir = Math.sign(this.endCoord.y - this.startCoord.y);
      const startsWithin =
        this.startCoord.x * xDir <= segment.startCoord.x * xDir &&
        this.startCoord.y * yDir <= segment.startCoord.y * yDir;
      const endsWithin =
        this.endCoord.x * xDir >= segment.endCoord.x * xDir &&
        this.endCoord.y * yDir >= segment.endCoord.y * yDir;
      if (startsWithin && endsWithin) return true;

      return false;
    }
  }
}

module.exports = Segment;
