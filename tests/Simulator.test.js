"use strict";

const Segment = require("../Segment");
const TrailFactory = require("../TrailFactory");
const Mesh = require("../Mesh");

describe("Segments", () => {
  test("Segment Starts outside of boundry", () => {
    expect(
      () =>
        new Segment(
          { x: Segment.boundry.width + 1, y: 0 },
          { x: Segment.boundry.width, y: Segment.boundry.height },
        ),
    ).toThrow(
      `Segment Can't start outside of the boundry [ (0,0) , (${Segment.boundry.width}, ${Segment.boundry.height}) ]`,
    );

    expect(
      () =>
        new Segment(
          { x: 0, y: Segment.boundry.height + 1 },
          { x: Segment.boundry.width, y: Segment.boundry.height },
        ),
    ).toThrow(
      `Segment Can't start outside of the boundry [ (0,0) , (${Segment.boundry.width}, ${Segment.boundry.height}) ]`,
    );

    expect(
      () =>
        new Segment(
          { x: -1, y: Segment.boundry.height },
          { x: Segment.boundry.width, y: Segment.boundry.height },
        ),
    ).toThrow(
      `Segment Can't start outside of the boundry [ (0,0) , (${Segment.boundry.width}, ${Segment.boundry.height}) ]`,
    );

    expect(
      () =>
        new Segment(
          { x: Segment.boundry.width, y: -1 },
          { x: Segment.boundry.width, y: Segment.boundry.height },
        ),
    ).toThrow(
      `Segment Can't start outside of the boundry [ (0,0) , (${Segment.boundry.width}, ${Segment.boundry.height}) ]`,
    );
  });

  test("Segment ends outside of boundy", () => {
    expect(
      () =>
        new Segment(
          { x: 0, y: 0 },
          { x: Segment.boundry.width + 1, y: Segment.boundry.height },
        ),
    ).toThrow(
      `Segment Can't end outside of the boundry [ (0,0) , (${Segment.boundry.width}, ${Segment.boundry.height}) ]`,
    );

    expect(
      () =>
        new Segment(
          { x: 0, y: 0 },
          { x: Segment.boundry.width, y: Segment.boundry.height + 1 },
        ),
    ).toThrow(
      `Segment Can't end outside of the boundry [ (0,0) , (${Segment.boundry.width}, ${Segment.boundry.height}) ]`,
    );

    expect(
      () =>
        new Segment(
          { x: 0, y: 0 },
          { x: Segment.boundry.width + 1, y: Segment.boundry.height },
        ),
    ).toThrow(
      `Segment Can't end outside of the boundry [ (0,0) , (${Segment.boundry.width}, ${Segment.boundry.height}) ]`,
    );

    expect(
      () =>
        new Segment(
          { x: Segment.boundry.width, y: Segment.boundry.height },
          { x: -1, y: Segment.boundry.height },
        ),
    ).toThrow(
      `Segment Can't end outside of the boundry [ (0,0) , (${Segment.boundry.width}, ${Segment.boundry.height}) ]`,
    );

    expect(
      () =>
        new Segment(
          { x: Segment.boundry.width, y: Segment.boundry.height },
          { x: Segment.boundry.width, y: -1 },
        ),
    ).toThrow(
      `Segment Can't end outside of the boundry [ (0,0) , (${Segment.boundry.width}, ${Segment.boundry.height}) ]`,
    );
  });

  test("Invalid length segment", () => {
    expect(() => {
      new Segment({ x: 0, y: 0 }, { x: Segment.minLength - 1, y: 0 });
    }).toThrow(`Segment Can't be shorter than ${Segment.minLength}`);
  });

  test("Variable assignment", () => {
    const seg1 = new Segment(
      { x: Segment.boundry.width, y: Segment.boundry.width },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment.minLength,
      },
    );

    expect(seg1.startCoord).toEqual({
      x: Segment.boundry.width,
      y: Segment.boundry.width,
    });
    expect(seg1.endCoord).toEqual({
      x: Segment.boundry.width - Segment.minLength,
      y: Segment.boundry.width - Segment.minLength,
    });
  });

  test("Equal segments", () => {
    const seg1 = new Segment(
      { x: Segment.boundry.width, y: Segment.boundry.width },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment.minLength,
      },
    );

    const seg2 = new Segment(
      { x: Segment.boundry.width, y: Segment.boundry.width },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment.minLength,
      },
    );

    const seg3 = new Segment(
      { x: Segment.boundry.width, y: 0 },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment.minLength,
      },
    );

    const seg4 = new Segment(
      { x: 0, y: Segment.boundry.width },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment.minLength,
      },
    );

    const seg5 = new Segment(
      { x: Segment.boundry.width, y: Segment.boundry.width },
      { x: Segment.boundry.width - Segment.minLength, y: 0 },
    );

    const seg6 = new Segment(
      { x: Segment.boundry.width, y: Segment.boundry.width },
      { x: 0, y: Segment.boundry.height - Segment.minLength },
    );

    expect(seg1.isEqual(seg2)).toEqual(true);
    expect(seg1.isEqual(seg3)).toEqual(false);
    expect(seg1.isEqual(seg4)).toEqual(false);
    expect(seg1.isEqual(seg5)).toEqual(false);
    expect(seg1.isEqual(seg6)).toEqual(false);
  });

  test("starting point validation(it extends to ending point validation)", () => {
    const left_seg = new Segment(
      { x: 0, y: Segment.boundry.height - Segment.minLength },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment.minLength,
      },
    );
    const right_seg = new Segment(
      {
        x: Segment.boundry.width,
        y: Segment.boundry.height - Segment.minLength,
      },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment.minLength,
      },
    );
    const upper_seg = new Segment(
      { x: Segment.boundry.width - Segment.minLength, y: 0 },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment.minLength,
      },
    );
    const lower_seg = new Segment(
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height,
      },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment.minLength,
      },
    );
    const upper_left = new Segment(
      { x: 0, y: 0 },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment.minLength,
      },
    );
    const upper_right = new Segment(
      { x: Segment.boundry.width, y: 0 },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment,
      },
    );
    const lower_right = new Segment(
      { x: Segment.boundry.width, y: Segment.boundry.height },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment,
      },
    );
    const lower_left = new Segment(
      { x: 0, y: Segment.boundry.height },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment,
      },
    );

    expect([
      Segment.isOnLeftedge(left_seg.startCoord),
      Segment.isOnRightendge(left_seg.startCoord),
      Segment.isOnLowerEdge(left_seg.startCoord),
      Segment.isOnUpperEdge(left_seg.startCoord),
      left_seg.isValidStartingSeg(),
    ]).toEqual([true, false, false, false, true]);

    expect([
      Segment.isOnLeftedge(right_seg.startCoord),
      Segment.isOnRightendge(right_seg.startCoord),
      Segment.isOnLowerEdge(right_seg.startCoord),
      Segment.isOnUpperEdge(right_seg.startCoord),
      right_seg.isValidStartingSeg(),
    ]).toEqual([false, true, false, false, true]);

    expect([
      Segment.isOnLeftedge(upper_seg.startCoord),
      Segment.isOnRightendge(upper_seg.startCoord),
      Segment.isOnLowerEdge(upper_seg.startCoord),
      Segment.isOnUpperEdge(upper_seg.startCoord),
      upper_seg.isValidStartingSeg(),
    ]).toEqual([false, false, false, true, true]);

    expect([
      Segment.isOnLeftedge(lower_seg.startCoord),
      Segment.isOnRightendge(lower_seg.startCoord),
      Segment.isOnLowerEdge(lower_seg.startCoord),
      Segment.isOnUpperEdge(lower_seg.startCoord),
      lower_seg.isValidStartingSeg(),
    ]).toEqual([false, false, true, false, true]);

    expect([
      Segment.isOnLeftedge(upper_left.startCoord),
      Segment.isOnRightendge(upper_left.startCoord),
      Segment.isOnLowerEdge(upper_left.startCoord),
      Segment.isOnUpperEdge(upper_left.startCoord),
      upper_left.isValidStartingSeg(),
    ]).toEqual([true, false, false, true, true]);

    expect([
      Segment.isOnLeftedge(lower_left.startCoord),
      Segment.isOnRightendge(lower_left.startCoord),
      Segment.isOnLowerEdge(lower_left.startCoord),
      Segment.isOnUpperEdge(lower_left.startCoord),
      lower_left.isValidStartingSeg(),
    ]).toEqual([true, false, true, false, true]);

    expect([
      Segment.isOnLeftedge(upper_right.startCoord),
      Segment.isOnRightendge(upper_right.startCoord),
      Segment.isOnLowerEdge(upper_right.startCoord),
      Segment.isOnUpperEdge(upper_right.startCoord),
      upper_right.isValidStartingSeg(),
    ]).toEqual([false, true, false, true, true]);

    expect([
      Segment.isOnLeftedge(lower_right.startCoord),
      Segment.isOnRightendge(lower_right.startCoord),
      Segment.isOnLowerEdge(lower_right.startCoord),
      Segment.isOnUpperEdge(lower_right.startCoord),
      lower_right.isValidStartingSeg(),
    ]).toEqual([false, true, true, false, true]);

    const valid_end_1 = new Segment(
      { x: 0, y: 0 },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height,
      },
    );
    const valid_end_2 = new Segment(
      { x: 0, y: 0 },
      {
        x: Segment.boundry.width,
        y: Segment.boundry.height - Segment.minLength,
      },
    );

    expect([
      valid_end_1.isValidEndingSeg(),
      valid_end_2.isValidEndingSeg(),
      lower_right.isValidEndingSeg(),
    ]).toEqual([true, true, false]);

    const seg1 = new Segment(
      { x: 0, y: 1.5 },
      {
        x: Segment.boundry.width - Segment.minLength,
        y: Segment.boundry.height - Segment.minLength,
      },
    );
    expect(Segment.isOnLeftedge(seg1.startCoord)).toEqual(true);
  });

  test("Connected segment", () => {
    const seg1 = new Segment({ x: 0, y: 0 }, { x: 2, y: 2 });
    const seg2 = new Segment({ x: 2, y: 2 }, { x: 0, y: 0 });

    expect(seg1.isConnected(seg2)).toEqual(true);
    expect(seg2.isConnected(seg1)).toEqual(true);

    const seg3 = new Segment({ x: 0, y: 1 }, { x: 3, y: 3 });
    const seg4 = new Segment({ x: 3, y: 3 }, { x: 3, y: 0 });
    const seg5 = new Segment({ x: 3, y: 0 }, { x: 10, y: 10 });
    const segDummy = new Segment({ x: 9, y: 9 }, { x: 0, y: 1 });
    const Segments1 = [seg3, seg4, seg5, segDummy];
    const Segments2 = [seg3, seg4, seg5];
    const Segments3 = [seg3, seg5, seg4];
    const Segments4 = [seg5, seg4, seg3];
    const Segments5 = [seg5, seg5];

    expect(Segment.isConnectedAll(Segments1)).toEqual(false);
    expect(Segment.isConnectedAll(Segments2)).toEqual(true);
    expect(Segment.isConnectedAll(Segments3)).toEqual(false);
    expect(Segment.isConnectedAll(Segments4)).toEqual(false);
    expect(() => Segment.isConnectedAll([])).toThrow(
      "Segments list can't be empty",
    );
    expect(Segment.isConnectedAll(Segments5)).toEqual(false);
  });
});
describe("trailFactory", () => {
  test("Connected segment", () => {
    const seg1 = new Segment({ x: 0, y: 0 }, { x: 2, y: 2 });
    const seg1_dup = new Segment({ x: 0, y: 0 }, { x: 2, y: 2 });
    const seg2 = new Segment({ x: 2, y: 2 }, { x: 0, y: 0 });
    const seg3 = new Segment({ x: 0, y: 1 }, { x: 3, y: 3 });
    const seg4 = new Segment({ x: 0, y: 3 }, { x: 3, y: 0 });
    const seg5 = new Segment({ x: 3, y: 0 }, { x: 10, y: 30 });
    const mesh = new Mesh([seg1, seg2, seg3, seg4, seg5, seg1_dup]);
    const trailFactory = new TrailFactory(mesh);
    trailFactory.setTrail([seg1, seg2]);
    trailFactory.setTrail([seg1, seg2]);
    trailFactory.setTrail([seg1_dup, seg2]);
    expect(trailFactory.getAllTrails().length).toEqual(1);
    trailFactory.setTrail([seg4, seg5]);
    expect(trailFactory.getAllTrails().length).toEqual(2);
    expect(trailFactory.hasTrail([seg1, seg2])).toEqual(true);
    expect(trailFactory.hasTrail([seg1_dup, seg2])).toEqual(true);
  });
});
