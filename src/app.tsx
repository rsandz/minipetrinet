import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Diagram from "./components/diagram";
import Sidebar from "./components/sidebar";
import { AppBar, Toolbar, Typography, Grid, Box } from "@mui/material";
import PetriNetDiagram from "./diagram/petriNetDiagram";
import { fabric as F } from "fabric";
import ObjectBar from "./components/objectbar";
import PetriNetContext from "./hooks/usePetriNet";
import PetriNet from "./models/petrinet";

function App(): JSX.Element {
  const workAreaRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<PetriNet>(new PetriNet());
  const diagramRef = useRef<PetriNetDiagram | null>(null);
  const canvasRef = useRef<F.Canvas | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_ready, setReady] = useState(false);

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

  const onCanvasReady = useCallback((canvas: F.Canvas) => {
    diagramRef.current = new PetriNetDiagram(canvas, modelRef.current);
    canvasRef.current = canvas;
    setReady(true);
  }, []);

  // Canvas must not re-render when app changes, so put it in an immutable
  // state.
  const [canvas] = useState(() => <Diagram onCanvasReady={onCanvasReady} />);

  return (
    <PetriNetContext.Provider
      value={{
        petriNetDiagram: diagramRef.current,
        petriNet: modelRef.current,
      }}
    >
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
                {canvas}
              </Grid>
            </Grid>
          </Box>
          <ObjectBar />
        </Box>
      </div>
    </PetriNetContext.Provider>
  );
}

export default App;
