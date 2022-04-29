import React, { useEffect, useRef } from "react";
import { fabric as F } from "fabric";

interface DiagramProps {
  canvasHeight?: number;
  canvasWidth?: number;
  onCanvasReady?: (canvas: F.Canvas) => void;
  onCanvasDestroy?: () => void;
}

const Diagram = ({
  onCanvasReady,
  onCanvasDestroy,
  canvasHeight = 600,
  canvasWidth = 800,
}: DiagramProps): JSX.Element => {
  const canvasRef = useRef<F.Canvas>();

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.setHeight(canvasHeight);
      canvasRef.current.setWidth(canvasWidth);
    }
  });

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
