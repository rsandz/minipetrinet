import { fabric as F } from "fabric";

export function normalizeVector(v: F.Point) {
  return v.divide(v.distanceFrom({ x: 0, y: 0 }));
}

export function vectorLength(v: F.Point) {
  return v.distanceFrom({ x: 0, y: 0 });
}
