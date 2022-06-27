import React, { useEffect } from "react";

import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { usePetriNet } from "../hooks/usePetriNet";
import { MarkingMap } from "../models/petrinet";

interface StatsModalProps {
  open: boolean;
  onClose?: () => void;
}

interface TabPanelProps {
  value: number;
  index: number;
  children?: React.ReactNode;
}

function TabPanel({ value, index, children }: TabPanelProps): JSX.Element {
  const isHidden = value !== index;
  return (
    <Box p={1} hidden={isHidden}>
      {!isHidden && children}
    </Box>
  );
}

function StatsModal({ open, onClose }: StatsModalProps): JSX.Element {
  const { petriNet } = usePetriNet();
  const [data, setData] = React.useState<MarkingMap[]>([]);
  const [tab, setTab] = React.useState(0);

  useEffect(() => {
    const onSimulate = () => {
      const markings = petriNet.getMarkings();
      setData((data) => [...data, markings]);
    };
    petriNet.on("simulate", onSimulate);
    return () => petriNet.off("simulate", onSimulate);
  }, [petriNet]);

  let averageData: MarkingMap = {};
  if (data.length > 0) {
    // Sum total tokens for each marking
    averageData = data.reduce((acc, curr) => {
      for (const [marking, count] of Object.entries(curr)) {
        acc[marking] = (acc[marking] || 0) + count;
      }
      return acc;
    }, {}); // Initial value must be empty object to prevent mutation

    // Take average of all markings
    for (const [marking, count] of Object.entries(averageData)) {
      averageData[marking] = count / data.length;
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight="bold">Statistics</Typography>
          <Box>
            <Button
              variant="contained"
              onClick={() => {
                setData([]);
              }}
              sx={{marginRight: "1rem"}}
            >
              Reset Statistics
            </Button>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => (onClose ? onClose() : undefined)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}>
          <Tab label="Graphs" />
          <Tab label="Marking List" />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <Bar
            options={{
              elements: {
                bar: {
                  borderWidth: 2,
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: "Average Number of Tokens per Place",
                },
              },
            }}
            data={{
              datasets: [
                {
                  label: "Number of Tokens",
                  data: averageData,
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgba(255, 99, 132, 1)",
                },
              ],
            }}
          />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Index</TableCell>
                {Object.keys(data[0] ?? []).map((id) => (
                  <TableCell key={id}>{id}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(data).map(([index, markings]) => (
                <TableRow key={index}>
                  <TableCell>{index}</TableCell>
                  {Object.values(markings).map((count) => {
                    return <TableCell>{count}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}

export default StatsModal;
