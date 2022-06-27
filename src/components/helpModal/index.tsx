import {
  Dialog,
  IconButton,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface HelpModalProps {
  open: boolean;
  onClose?: () => void;
}

function HelpModal({ open, onClose }: HelpModalProps): JSX.Element {
  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight="bold" variant="h4" component="h1">
            Help Manual
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => (onClose ? onClose() : undefined)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <hr />
      </DialogTitle>
      <DialogContent>
        <Typography paragraph>
          MiniPetriNet is an online simulator for&nbsp;
          <a href="https://en.wikipedia.org/wiki/Petri_net#:~:text=A%20Petri%20net%20is%20a,contain%20at%20least%20one%20token">
            petri nets
          </a>
          . It has applications in reliability engineering, process engineering
          and many more!
        </Typography>
        <Typography paragraph>
          This simulator has the following features:
        </Typography>
        <Typography>
          <ul>
            <li>Visual editor for places, arcs and transitions.</li>
            <li>Step-by-step simulator for the petri net.</li>
            <li>Statistics tracking for tokens in places.</li>
          </ul>
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Creating a Petri Net
        </Typography>
        <Typography paragraph>
          Use the side bar on the left to add places and transitions. Clicking
          on the added places and transitions allows you to edit their
          properties using the right side bar. For example, you may edit the
          probability of firing for transitions.
        </Typography>
        <Typography paragraph>
          To create an arc, hold <kbd>control</kbd>. Then click and drag from a
          source place/transition to a target transition/place. Recall that
          since a petri net is bipartite, places may only be connected to
          transitions and vice-versa.
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Simulating a Petri Net
        </Typography>
        <Typography paragraph>
          To simulate a petri net, click on the "Simulate" button in the left
          side bar. This will step the simulation once.
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Statistics Tracking
        </Typography>
        <Typography paragraph>
          When you add a place to the petri net, the statistics for the place's
          tokens will be tracked. You can view the statistics for the petri net
          by clicking on the "Statistics" button in the left side bar.
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Issues and Suggestions
        </Typography>
        <Typography paragraph>
          If you encounter an issue, bug, or have a suggestions, please create
          an issue in this GitHub Repository:{" "}
          <a href="https://github.com/rsandz/minipetrinet">
            https://github.com/rsandz/minipetrinet
          </a>
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default HelpModal;
