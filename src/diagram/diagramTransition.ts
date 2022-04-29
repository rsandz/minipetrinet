import Transition from "../models/transition";
import { fabric as F } from "fabric";

class DiagramTransition {
  transition: Transition;
  canvas: F.Canvas;
  rootGroup: F.Group;
  probText: F.Text;

  constructor(canvas: F.Canvas, transition: Transition) {
    this.transition = transition;
    this.canvas = canvas;

    const rectangle = new F.Rect({
      top: 50,
      left: 0,
      height: 150,
      width: 50,
      fill: 'white',
      stroke: "black",

    });

    this.probText = new F.Text(this.transition.probability.toFixed(1));

    this.rootGroup = new F.Group([rectangle, this.probText]);
    this.rootGroup.hasControls = false;

    this.canvas.add(this.rootGroup);
  }
}

export default DiagramTransition;
