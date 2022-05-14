import { fabric as F } from "fabric";
import PetriNet from "../models/petrinet";
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

  simulate() {
    this.petrinet.simulate();
  }
}

export default PetriNetDiagram;
