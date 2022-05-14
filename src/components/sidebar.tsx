import { Drawer, Button, Toolbar, Typography, Stack } from "@mui/material";

const drawerWidth = 280;

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
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Stack p={1}>
        <Typography variant="body1" fontWeight="bold">
          Nodes:
        </Typography>
        <Stack spacing={2} direction="row">
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
    </Drawer>
  );
}

export default Sidebar;
