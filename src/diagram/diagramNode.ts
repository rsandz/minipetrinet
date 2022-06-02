import { fabric as F } from "fabric";

abstract class DiagramNode {
  abstract root: F.Object;
  abstract canvas: F.Canvas;

  /**
   * Find another point on the node's border
   * that is closest to the given point.
   */
  abstract projectPointToBorder(point: F.Point): F.Point;

  /**
   * Delete this object from the diagram.
   */
  delete(): void {
    this.canvas.remove(this.root);
    this.canvas.requestRenderAll();
  }
}

export default DiagramNode;
