import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { useCallback } from "react";
import { useTransition } from "../hooks/usePetriNet";

interface TransitionEditorProps {
  transitionId: string;
}

const TransitionEditor = ({
  transitionId: id,
}: TransitionEditorProps): JSX.Element => {
  const { data, setProbability } = useTransition(id);

  const handleOnProbabilityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let probability_percent = parseFloat(e.target.value);
      probability_percent = isNaN(probability_percent) ? 0 : probability_percent;
      probability_percent = Math.min(100, Math.max(0, probability_percent));
      setProbability(probability_percent / 100.0);
    },
    [setProbability]
  );

  return (
    <Stack p={1}>
      <Typography variant="body1" fontWeight="bold">
        Transition
      </Typography>
      <Stack pt={1} spacing={2} component="form" noValidate autoComplete="off">
        <TextField id="transition-id" label="ID" value={data.id} />
        <TextField
          id="transition-probability"
          label="Probability"
          type="number"
          value={data.probability * 100}
          onChange={handleOnProbabilityChange}
          InputProps={{
            inputProps: { min: 0, max: 100, step: "0.01" },
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
      </Stack>
    </Stack>
  );
};

export default TransitionEditor;
