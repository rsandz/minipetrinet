import Place from "../models/place";
import { fabric as F } from "fabric";
import DiagramNode from "./diagramNode";
import { normalizeVector } from "./utils";

class DiagramPlace extends DiagramNode {
  place: Place;
  canvas: F.Canvas;

  RADIUS: number = 75;

  // Canvas objects
  circle: F.Circle;
  name: F.Text;
  numToken: F.Text;
  root: F.Group;

  constructor(canvas: F.Canvas, place: Place) {
    super();
    this.place = place;
    this.canvas = canvas;

    this.circle = new F.Circle({
      radius: this.RADIUS,
      stroke: "black",
      strokeWidth: 3,
      fill: "lightblue",
    });

    this.name = new F.Text(place.id, {
      top: 20,
      originX: "center",
      left: this.RADIUS,
    });

    this.numToken = new F.Textbox(place.tokens.toString(), {
      top: 70,
      originX: "center",
      left: this.RADIUS,
    });

    this.root = new F.Group([this.circle, this.name, this.numToken]);
    this.root.data = { diagram: this };

    this.canvas.add(this.root);

    this.place.on("update", () => {
      this.update();
    });
  }

  update() {
    this.numToken.set("text", this.place.tokens.toString());
    this.name.set("text", this.place.id);
    this.canvas.renderAll();
  }

  projectPointToBorder(point: F.Point): F.Point {
    // Assume X and Y radius same
    const scaledRadius = this.circle.getRadiusX();
    const normalVector = point.subtract(this.root.getCenterPoint());
    const centerToBorderVector =
      normalizeVector(normalVector).multiply(scaledRadius);

    return this.root.getCenterPoint().add(centerToBorderVector);
  }

  delete(): void {
    super.delete();
  }
}

export default DiagramPlace;
