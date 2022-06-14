import { Drawer, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { usePetriNet } from "../hooks/usePetriNet";
import PlaceEditor from "./placeEditor";
import TransitionEditor from "./transitionEditor";

const drawerWidth = 280;

/**
 * Shows the node editor for the selected object in the diagram.
 */
function ObjectBar(): JSX.Element {
  const [type, setType] = useState<"place" | "transition" | null>(null);
  const [id, setId] = useState<string>("");

  usePetriNet({
    onSelect: (type, id) => {
      setType(type);
      setId(id);
    },
  });

  let output;
  if (type === "place") {
    output = <PlaceEditor placeId={id} />;
  } else if (type === "transition") {
    output = <TransitionEditor transitionId={id} />;
  } else {
    output = <Typography p={1}>No object selected.</Typography>;
  }

  return (
    <Drawer
      anchor="right"
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      {output}
    </Drawer>
  );
}

export default ObjectBar;
