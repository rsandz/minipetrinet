import React from "react";

import { Drawer, Button, Toolbar, Typography, Stack } from "@mui/material";
import StatsModal from "./statsModal";

const drawerWidth = "15%";

interface SidebarProps {
  onAddPlace: () => void;
  onAddTransition: () => void;
  onSimulate: () => void;
}

function Sidebar({
  onAddPlace,
  onAddTransition,
  onSimulate,
}: SidebarProps): JSX.Element {
  const [statsOpen, setStatsOpen] = React.useState(false);

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Stack p={1}>
          <Typography variant="body1" fontWeight="bold">
            Nodes:
          </Typography>
          <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
            <Button fullWidth variant="outlined" onClick={onAddPlace}>
              Place
            </Button>
            <Button fullWidth variant="outlined" onClick={onAddTransition}>
              Transition
            </Button>
          </Stack>
        </Stack>
        <Stack p={1}>
          <Button fullWidth variant="contained" onClick={onSimulate}>
            Simulate
          </Button>
        </Stack>
        <Stack p={1}>
          <Typography variant="body1" fontWeight="bold">
            Statistics
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setStatsOpen(!statsOpen)}
          >
            Show Statistics
          </Button>
        </Stack>
      </Drawer>
      <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)} />
    </>
  );
}

export default Sidebar;
