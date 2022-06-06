import { fabric as F } from "fabric";
import Arrow from "./arrow";
import DiagramPlace from "./diagramPlace";
import DiagramTransition from "./diagramTransition";
import PetriNetDiagram from "./petriNetDiagram";

const deleteIcon = require("../images/delete.png");

/**
 * Draw arrow when modifier is pressed and connect models.
 */
function bindComponentConnect(canvas: F.Canvas, petrinet: PetriNetDiagram) {
  let arrow: Arrow | null = null;
  let connecting = false;

  canvas.on("mouse:down:before", (e) => {
    if (!e.pointer) return;
    if (!e.e.ctrlKey) return;

    // If selecting something, don't make line
    if (canvas.getActiveObjects().length !== 0) return;

    // Lock all movement and selection
    canvas.forEachObject((o) => {
      o.set("lockMovementX", true);
      o.set("lockMovementY", true);
    });

    const x = e.pointer.x;
    const y = e.pointer.y;

    arrow = new Arrow(canvas, [x, y, x, y]);

    connecting = true;
  });

  canvas.on("mouse:move", (e) => {
    if (!e.pointer || !arrow) {
      return;
    }

    arrow.setEnd(e.pointer.x, e.pointer.y);
  });

  canvas.on("mouse:up:before", (e) => {
    if (arrow) {
      arrow.remove();
      arrow = null;
    } else {
      // Nothing is selected at the moment.
      return;
    }

    // Re-enable all movement
    canvas.forEachObject((o) => {
      o.set("lockMovementX", false);
      o.set("lockMovementY", false);
    });
  });

  // Connect models together
  canvas.on("mouse:up", (e) => {
    if (connecting) {
      connecting = false;
    } else {
      return;
    }

    // Handles component connection when modifier key is pressed.
    const srcComponent = e.target?.data?.diagram;
    const targetComponent = e.currentTarget?.data?.diagram;

    if (!srcComponent || !targetComponent) return;
    try {
      petrinet.connect(srcComponent, targetComponent);
    } catch {
      // If fail to create arc, then bail
    }
  });
}

function configureDelete(petrinet: PetriNetDiagram) {
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
        petrinet.delete(target.data.diagram);
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
}

function bindSelectListener(canvas: F.Canvas, petrinet: PetriNetDiagram) {
  const handleSelection = ({selected}: {selected: F.Object[]}) => {
    if (selected.length === 0) {
      return;
    }
    const node = selected[0].data?.diagram;
    if (
      node instanceof DiagramPlace ||
      node instanceof DiagramTransition
    ) {
      petrinet.fire("select", node);
    }
  };

  // @ts-ignore Since types for this event handling is not properly defined in fabric.
  canvas.on("selection:updated", handleSelection);
  // @ts-ignore
  canvas.on("selection:created", handleSelection);
}

function configureCanvas(canvas: F.Canvas, petrinet: PetriNetDiagram) {
  canvas.allowTouchScrolling = false;

  // Disable multiselect
  canvas.selection = false;

  bindComponentConnect(canvas, petrinet);
  bindSelectListener(canvas, petrinet);
  configureDelete(petrinet);
}

export default configureCanvas;
