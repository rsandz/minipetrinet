import { fabric as F } from "fabric";
import Observable from "../models/observable";
import PetriNet from "../models/petrinet";
import DiagramArc from "./diagramArc";
import configureCanvas from "./diagramCanvas";
import DiagramPlace from "./diagramPlace";
import DiagramTransition from "./diagramTransition";

type PetriNetDiagramEvents = "select";

/**
 * Represents the petrinet diagram on the canvas.
 */
class PetriNetDiagram extends Observable<PetriNetDiagramEvents> {
  canvas: F.Canvas;
  petrinet: PetriNet;
  selected: null | DiagramPlace | DiagramTransition;

  constructor(canvas: F.Canvas, petrinet: PetriNet) {
    super();
    this.canvas = canvas;
    this.petrinet = petrinet
    this.selected = null;
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

  delete(node: DiagramPlace): void;
  delete(node: DiagramTransition): void;
  delete(node: DiagramPlace | DiagramTransition): void {
    if (node instanceof DiagramPlace) {
      this.petrinet.delete(node.place);
    } else if (node instanceof DiagramTransition) {
      this.petrinet.delete(node.transition);
    }
  }

  connect(from: DiagramPlace, to: DiagramTransition): DiagramArc;
  connect(from: DiagramTransition, to: DiagramPlace): DiagramArc;
  connect(
    from: DiagramTransition | DiagramPlace,
    to: DiagramTransition | DiagramPlace
  ): DiagramArc {
    if (from instanceof DiagramPlace && to instanceof DiagramTransition) {
      const arc = this.petrinet.connect(from.place, to.transition);
      const diagramArc = new DiagramArc(this.canvas, from, to, arc);
      return diagramArc;
    } else if (
      from instanceof DiagramTransition &&
      to instanceof DiagramPlace
    ) {
      const arc = this.petrinet.connect(from.transition, to.place);
      const diagramArc = new DiagramArc(this.canvas, from, to, arc);
      return diagramArc;
    }
    throw new Error(`Cannot connect ${from} to ${to}`);
  }

  simulate() {
    this.petrinet.simulate();
  }
}

export default PetriNetDiagram;
