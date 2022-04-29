import Place from "../models/place";
import { fabric as F } from "fabric";

class DiagramPlace {
  place: Place;
  canvas: F.Canvas;

  radius: number;

  // Canvas objects
  circle: F.Circle;
  name: F.Text;
  numToken: F.Text;
  rootGroup: F.Group;

  constructor(canvas: F.Canvas, place: Place) {
    this.place = place;
    this.canvas = canvas;
    this.radius = 75;

    this.circle = new F.Circle({
      radius: this.radius,
      stroke: "black",
      strokeWidth: 3,
      fill: "lightblue",
    });

    this.name = new F.Text(place.id, {
      top: 20,
      originX: "center",
      left: this.radius,
    });

    this.numToken = new F.Textbox(place.tokens.toString(), {
      top: 70,
      originX: "center",
      left: this.radius,
    });

    this.rootGroup = new F.Group([this.circle, this.name, this.numToken]);
    this.rootGroup.hasControls = false;
    this.rootGroup.data = {"model": this.place}

    this.canvas.add(this.rootGroup);

    this.place.registerObserver(this);
  }

  update() {
    this.numToken.set("text", this.place.tokens.toString());
    this.name.set("text", this.place.id);
    this.canvas.renderAll();
  }
}

export default DiagramPlace;
