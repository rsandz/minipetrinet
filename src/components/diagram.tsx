import React, { useRef } from "react";
import { fabric as F } from "fabric";

interface DiagramProps {
  onCanvasReady?: (canvas: F.Canvas) => void;
  onCanvasDestroy?: () => void;
}

const Diagram = ({
  onCanvasReady,
  onCanvasDestroy,
}: DiagramProps): JSX.Element => {
  const canvasRef = useRef<F.Canvas>();

  // One-off canvas setup
  const fabricCallbackRef = (element: HTMLCanvasElement) => {
    if (!element) {
      // This component is unmounting
      canvasRef.current?.dispose();
      if (onCanvasDestroy) onCanvasDestroy();
    }

    canvasRef.current = new F.Canvas(element);
    if (onCanvasReady) onCanvasReady(canvasRef.current);
  };

  return <canvas id="diagram" ref={fabricCallbackRef} />;
};

export default Diagram;
