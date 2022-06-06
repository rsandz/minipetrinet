import Arrow from "./arrow";
import DiagramPlace from "./diagramPlace";
import DiagramTransition from "./diagramTransition";

import { fabric as F } from "fabric";
import { vectorLength } from "./utils";
import Arc from "../models/arc";

type Component = DiagramPlace | DiagramTransition;

class DiagramArc {
  arc: Arc<unknown, unknown>;
  diagramPlace: DiagramPlace;
  diagramTransition: DiagramTransition;
  canvas: F.Canvas;

  arrow: Arrow;
  multiplicityText: F.Text;

  // Gap between arc and component
  GAP_LENGTH = 10;
  MULTIPLICITY_TEXT_OFFSET = 25

  // Direction relative from transition.
  direction: "INPUT" | "OUTPUT";

  constructor(
    canvas: F.Canvas,
    src: Component,
    tgt: Component,
    arc: Arc<unknown, unknown>
  ) {
    this.canvas = canvas;
    this.arc = arc;

    // Bipartite graph can only connect place to transition and vice versa.
    if (src instanceof DiagramPlace && tgt instanceof DiagramTransition) {
      this.diagramPlace = src;
      this.diagramTransition = tgt;
      this.direction = "INPUT";
    } else if (
      src instanceof DiagramTransition &&
      tgt instanceof DiagramPlace
    ) {
      this.diagramPlace = tgt;
      this.diagramTransition = src;
      this.direction = "OUTPUT";
    } else {
      throw Error(`Cannot connect: ${src}, ${tgt}`);
    }

    // Set to [0, 0, 0, 0] as place holder.
    this.arrow = new Arrow(canvas, [0, 0, 0, 0], false);
    this.multiplicityText = new F.Text("");
    this.multiplicityText.set({
      selectable: false,
      originX: "center",
      originY: "center"
    })

    this.update();
    this.canvas.add(this.multiplicityText);

    // Register as observer so that arrow can be updated
    const onUpdate = () => this.update();
    this.diagramTransition.root.on("moving", onUpdate);
    this.diagramPlace.root.on("moving", onUpdate);

    const onDelete = () => {
      this.arrow.remove();
      this.canvas.remove(this.multiplicityText)
      this.arc.off("delete", onDelete);
      this.diagramTransition.root.off("moving", onUpdate);
      this.diagramPlace.root.off("moving", onUpdate);
    };
    this.arc.on("delete", onDelete);
  }

  update() {
    const placeBorderPoint = this.diagramPlace.projectPointToBorder(
      this.diagramTransition.root.getCenterPoint()
    );
    const transitionBorderPoint = this.diagramTransition.projectPointToBorder(
      this.diagramPlace.root.getCenterPoint()
    );

    const diffVector = placeBorderPoint.subtract(transitionBorderPoint);
    const diffVectorLength = vectorLength(diffVector);
    const scaledDiffVector = diffVector
      .divide(diffVectorLength)
      .multiply(this.GAP_LENGTH);

    if (diffVectorLength < 2 * this.GAP_LENGTH) {
      scaledDiffVector.setXY(0, 0);
    }

    const placeArrowPoint = placeBorderPoint.subtract(scaledDiffVector);
    const transitionArrowPoint = transitionBorderPoint.add(scaledDiffVector);

    if (this.direction === "INPUT") {
      this.arrow.setStart(placeArrowPoint.x, placeArrowPoint.y);
      this.arrow.setEnd(transitionArrowPoint.x, transitionArrowPoint.y);
    } else {
      this.arrow.setStart(transitionArrowPoint.x, transitionArrowPoint.y);
      this.arrow.setEnd(placeArrowPoint.x, placeArrowPoint.y);
    }

    const normalVector = new F.Point(diffVector.y, -diffVector.x)
      .divide(diffVectorLength)
      .multiply(25);
    const halfDiffVector = diffVector.divide(2);
    const textLocation = transitionBorderPoint
      .add(halfDiffVector)
      .subtract(normalVector);

    this.multiplicityText.set("left", textLocation.x);
    this.multiplicityText.set("top", textLocation.y);
    this.multiplicityText.set("text", this.arc.multiplicity.toString());
  }
}

export default DiagramArc;
