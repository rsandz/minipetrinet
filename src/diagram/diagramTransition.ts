import Transition from "../models/transition";
import { fabric as F } from "fabric";
import DiagramNode from "./diagramNode";
import { normalizeVector } from "./utils";

class DiagramTransition extends DiagramNode {
  transition: Transition;
  canvas: F.Canvas;
  root: F.Group;
  probText: F.Text;

  constructor(canvas: F.Canvas, transition: Transition) {
    super();
    this.transition = transition;
    this.canvas = canvas;

    const rectangle = new F.Rect({
      top: 50,
      left: 0,
      height: 150,
      width: 50,
      fill: "white",
      stroke: "black",
    });

    this.probText = new F.Text(this.transition.probability.toFixed(1));

    this.root = new F.Group([rectangle, this.probText]);
    this.root.data = { diagram: this };

    this.canvas.add(this.root);
  }

  projectPointToBorder(point: F.Point): F.Point {
    // Assume X and Y radius same
    const scaledRadius = 75;
    const normalVector = point.subtract(this.root.getCenterPoint());
    const centerToBorderVector =
      normalizeVector(normalVector).multiply(scaledRadius);

    return this.root.getCenterPoint().add(centerToBorderVector);
  }
}

export default DiagramTransition;
