import Arrow from "./arrow";
import DiagramPlace from "./diagramPlace";
import DiagramTransition from "./diagramTransition";

import { fabric as F } from "fabric";
import { vectorLength } from "./utils";

type Component = DiagramPlace | DiagramTransition;

class DiagramArc {
  diagramPlace: DiagramPlace;
  diagramTransition: DiagramTransition;
  canvas: F.Canvas;

  arrow: Arrow;

  // Gap between arc and component
  GAP_LENGTH = 10;

  // Direction relative from transition.
  direction: "INPUT" | "OUTPUT";

  constructor(canvas: F.Canvas, src: Component, tgt: Component) {
    this.canvas = canvas;

    // Bipartite graph can only connect place to transition and vice versa.
    if (src instanceof DiagramPlace && tgt instanceof DiagramTransition) {
      this.diagramPlace = src;
      this.diagramTransition = tgt;
      this.direction = "INPUT";
      this.diagramTransition.transition.addInPlace(this.diagramPlace.place);
    } else if (
      src instanceof DiagramTransition &&
      tgt instanceof DiagramPlace
    ) {
      this.diagramPlace = tgt;
      this.diagramTransition = src;
      this.direction = "OUTPUT";
      this.diagramTransition.transition.addOutPlace(this.diagramPlace.place);
    } else {
      throw Error(`Cannot connect: ${src}, ${tgt}`);
    }

    // Set to [0, 0, 0, 0] as place holder.
    this.arrow = new Arrow(canvas, [0, 0, 0, 0], false);
    this.updateArrow();

    // Register as observer so that arrow can be updated
    this.diagramTransition.root.on("moving", () => {
      this.updateArrow();
    });

    this.diagramPlace.root.on("moving", () => {
      this.updateArrow();
    });
  }

  updateArrow() {
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
  }
}

export default DiagramArc;
