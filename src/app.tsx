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
import PetriNet from "./models/petrinet";
import DiagramPlace from "./diagram/diagramPlace";
import { fabric as F } from "fabric";
import DiagramTransition from "./diagram/diagramTransition";
import configureCanvas from "./diagram/diagramCanvas";

function App(): JSX.Element {
  const [workAreaSpace, setWorkAreaSpace] = useState([0, 0]);
  const workAreaRef = useRef<HTMLDivElement>(null);

  const measureDiagramSpace = useCallback(() => {
    if (!workAreaRef.current) {
      return;
    }

    setWorkAreaSpace([
      workAreaRef.current.clientHeight,
      workAreaRef.current.clientWidth,
    ]);
  }, []);

  useLayoutEffect(measureDiagramSpace, [measureDiagramSpace]);
  useEffect(() => {
    window.addEventListener("resize", measureDiagramSpace);

    return () => {
      window.removeEventListener("resize", measureDiagramSpace);
    };
  });

  // ------------

  const petriNetRef = useRef(new PetriNet());
  const canvasRef = useRef<F.Canvas | null>(null);

  const onAddPlace = useCallback(() => {
    if (!canvasRef.current) return;
    const petrinet = petriNetRef.current;

    const place = petrinet.createPlace();
    new DiagramPlace(canvasRef.current, place);
  }, [petriNetRef]);

  const onAddTransition = useCallback(() => {
    if (!canvasRef.current) return;
    const petrinet = petriNetRef.current;

    const transition = petrinet.createTransition(1.0);

    new DiagramTransition(canvasRef.current, transition);
  }, [petriNetRef]);

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
        <Sidebar onAddPlace={onAddPlace} onAddTransition={onAddTransition} />
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Toolbar />
          <Grid container sx={{ flexGrow: 1 }}>
            <Grid item xs={12} ref={workAreaRef}>
              <Diagram
                canvasHeight={workAreaSpace[0]}
                canvasWidth={workAreaSpace[1]}
                onCanvasReady={(canvas) => {
                  configureCanvas(canvas);
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
