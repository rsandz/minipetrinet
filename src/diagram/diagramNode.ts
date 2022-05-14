import { fabric as F } from "fabric";

abstract class DiagramNode {
  abstract root: F.Object;
  abstract canvas: F.Canvas;

  /**
   * Find another point on the node's border
   * that is closest to the given point.
   */
  abstract projectPointToBorder(point: F.Point): F.Point;
}

export default DiagramNode;
