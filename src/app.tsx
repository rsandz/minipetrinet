import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import Diagram from "./components/diagram";
import Sidebar from "./components/sidebar";
import { AppBar, Toolbar, Typography, Grid, Box } from "@mui/material";
import PetriNetDiagram from "./diagram/petriNetDiagram";
import { fabric as F } from "fabric";
import configureCanvas from "./diagram/diagramCanvas";

function App(): JSX.Element {
  const workAreaRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<PetriNetDiagram | null>(null);
  const canvasRef = useRef<F.Canvas | null>(null);

  const measureDiagramSpace = useCallback(() => {
    if (!workAreaRef.current) return;
    if (!diagramRef.current) return;

    diagramRef.current.setDimensions(
      workAreaRef.current.clientWidth,
      workAreaRef.current.clientHeight
    );
  }, []);

  useLayoutEffect(measureDiagramSpace, [measureDiagramSpace]);
  useEffect(() => {
    window.addEventListener("resize", measureDiagramSpace);

    return () => {
      window.removeEventListener("resize", measureDiagramSpace);
    };
  });

  // ------------

  const onAddPlace = useCallback(() => {
    if (!diagramRef.current) return;
    diagramRef.current.addPlace();
  }, []);

  const onAddTransition = useCallback(() => {
    if (!diagramRef.current) return;
    diagramRef.current.addTransition();
  }, []);

  const onSimulate = useCallback(() => {
    if (!diagramRef.current) return;
    diagramRef.current.simulate();
  }, []);

  return (
    <div className="App">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, flexShrink: 0 }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" component="div">
            MiniPetriNet
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        id="workspace"
        sx={{ display: "flex", height: "100vh", width: "100vw" }}
      >
        <Sidebar
          onAddPlace={onAddPlace}
          onAddTransition={onAddTransition}
          onSimulate={onSimulate}
        />
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Toolbar />
          <Grid container sx={{ flexGrow: 1 }}>
            <Grid item xs={12} ref={workAreaRef}>
              <Diagram
                onCanvasReady={(canvas) => {
                  configureCanvas(canvas);
                  diagramRef.current = new PetriNetDiagram(canvas);
                  canvasRef.current = canvas;
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default App;
