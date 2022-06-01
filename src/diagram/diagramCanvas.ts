import { fabric as F } from "fabric";
import Arrow from "./arrow";
import DiagramArc from "./diagramArc";
import PetriNetDiagram from "./petriNetDiagram";

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

function configureCanvas(canvas: F.Canvas, petrinet: PetriNetDiagram) {
  canvas.allowTouchScrolling = false;

  // Disable multiselect
  canvas.selection = false;

  bindComponentConnect(canvas, petrinet);
}

export default configureCanvas;
