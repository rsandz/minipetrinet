import { fabric as F } from "fabric";
const deleteIcon = require("../images/delete.png");

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

const deleteImg = document.createElement("img");
deleteImg.src = deleteIcon;

F.Object.prototype.controls.deleteControl = new F.Control({
  x: 0.5,
  y: -0.5,
  offsetY: -15,
  offsetX: 15,
  cursorStyle: "pointer",
  mouseUpHandler: (event, transform) => {
    const target = transform.target;
    if (target.data.diagram && target.data.diagram.delete) {
      target.data.diagram.delete();
    }
    return true;
  },
  render: (ctx, left, top, styleOverride, fabricObject) => {
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(F.util.degreesToRadians(fabricObject.angle ?? 0));
    const size = 42;
    ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
    ctx.restore();
  },
});

// Disallow and hide control handles
F.Object.prototype.lockRotation = true;
F.Object.prototype.lockScalingX = true;
F.Object.prototype.lockScalingY = true;
F.Object.prototype.setControlsVisibility({
  bl: false,
  br: false,
  mb: false,
  ml: false,
  mr: false,
  mt: false,
  mtr: false,
  tl: false,
  tr: false,
});

export default DiagramNode;
