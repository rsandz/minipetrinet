import { fabric as F } from "fabric";
import PetriNet from "../models/petrinet";
import DiagramArc from "./diagramArc";
import configureCanvas from "./diagramCanvas";
import DiagramPlace from "./diagramPlace";
import DiagramTransition from "./diagramTransition";

/**
 * Represents the petrinet diagram on the canvas.
 */
class PetriNetDiagram {
  canvas: F.Canvas;
  petrinet: PetriNet;

  constructor(canvas: F.Canvas) {
    this.canvas = canvas;
    this.petrinet = new PetriNet();
    configureCanvas(this.canvas, this);
  }

  /**
   * Set the canvas height and width.
   */
  setDimensions(width: number, height: number) {
    const currentObjs = this.canvas.getObjects();
    this.canvas.clear();
    this.canvas.setHeight(height);
    this.canvas.setWidth(width);
    this.canvas.add(...currentObjs);
  }

  addPlace() {
    const place = this.petrinet.createPlace();
    place.addToken();
    new DiagramPlace(this.canvas, place);
  }

  addTransition() {
    const transition = this.petrinet.createTransition(1.0);
    new DiagramTransition(this.canvas, transition);
  }

  connect(from: DiagramPlace, to: DiagramTransition): DiagramArc;
  connect(from: DiagramTransition, to: DiagramPlace): DiagramArc;
  connect(
    from: DiagramTransition | DiagramPlace,
    to: DiagramTransition | DiagramPlace
  ): DiagramArc {
    if (from instanceof DiagramPlace && to instanceof DiagramTransition) {
      const arc = this.petrinet.connect(from.place, to.transition);
      const diagramArc = new DiagramArc(this.canvas, from, to);
      return diagramArc;
    } else if (
      from instanceof DiagramTransition &&
      to instanceof DiagramPlace
    ) {
      const arc = this.petrinet.connect(from.transition, to.place);
      const diagramArc = new DiagramArc(this.canvas, from, to);
      return diagramArc;
    }
    throw new Error(`Cannot connect ${from} to ${to}`);
  }

  simulate() {
    this.petrinet.simulate();
  }
}

export default PetriNetDiagram;
