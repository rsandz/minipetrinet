import { fabric as F } from "fabric";
import { runInThisContext } from "vm";

class Arrow {
  STROKE_WIDTH = 2;

  canvas: F.Canvas;
  startPoint: F.Point;
  endPoint: F.Point;
  rootGroup: F.Group;

  // Arrow body line
  line: F.Line;
  // Arrow head
  head: F.Polygon;

  constructor(canvas: F.Canvas, points: number[], selectable: boolean = true) {
    if (points.length !== 4) {
      throw Error("Arrow needs to have start points and end point.");
    }

    this.canvas = canvas;
    this.startPoint = new F.Point(points[0], points[1]);
    this.endPoint = new F.Point(points[2], points[3]);

    this.line = new F.Line(points, {
      stroke: "black",
      strokeWidth: this.STROKE_WIDTH,
    });

    this.head = new F.Polygon(
      [
        {
          x: 0,
          y: 4,
        },
        { x: 7, y: 0 },
        {
          x: 0,
          y: -4,
        },
      ],
      {
        stroke: "black",
        strokeWidth: this.STROKE_WIDTH,
        centeredRotation: true,
        originX: "center",
        originY: "center",
      }
    );

    this.rootGroup = new F.Group([this.line, this.head], {
      hasControls: false,
      hasBorders: false,
      lockMovementX: false,
      lockMovementY: false,
      selectable: selectable,
    });

    this._updateHead();
    this.canvas.add(this.rootGroup);
  }

  _updateHead() {
    const angle = Math.atan2(
      this.endPoint.y - this.startPoint.y,
      this.endPoint.x - this.startPoint.x
    );

    const localEndPoint = this.rootGroup.toLocalPoint(
      this.endPoint,
      "center",
      "center"
    );

    this.head.rotate((angle * 180) / Math.PI);
    this.head.set({
      left: localEndPoint.x,
      top: localEndPoint.y,
    });
  }

  /**
   * Update the line location after a group has been formed.
   * All line coords must be relative to the group.
   */
  _updateLine() {
    const localStartPoint = this.rootGroup.toLocalPoint(
      this.startPoint,
      "center",
      "center"
    );
    const localEndPoint = this.rootGroup.toLocalPoint(
      this.endPoint,
      "center",
      "center"
    );

    this.line.set({
      x1: localStartPoint.x,
      y1: localStartPoint.y,
      x2: localEndPoint.x,
      y2: localEndPoint.y,
    });
  }

  setStart(x: number, y: number) {
    this.startPoint.setXY(x, y);
    this._updateLine();
    this._updateHead();
    this.rootGroup.addWithUpdate(); // Force recalculate of group bounding box
    this.canvas.renderAll();
  }

  setEnd(x: number, y: number) {
    this.endPoint.setXY(x, y);
    this._updateLine();
    this._updateHead();
    this.rootGroup.addWithUpdate(); // Force recalculate of group bounding box
    this.canvas.renderAll();
  }

  remove() {
    this.canvas.remove(this.rootGroup);
    this.canvas.renderAll();
  }
}

export default Arrow;
