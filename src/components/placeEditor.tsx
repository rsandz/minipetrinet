import React, { useCallback } from "react";
import { Stack, TextField, Typography } from "@mui/material";
import { usePlace } from "../hooks/usePetriNet";

interface PlaceEditorProps {
  placeId: string;
}

/**
 * Form for editing Place properties.
 */
const PlaceEditor = ({ placeId }: PlaceEditorProps): JSX.Element => {
  const { data, setTokens } = usePlace(placeId);

  const handleTokenChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTokens(parseInt(e.target.value));
    },
    [setTokens]
  );

  return (
    <Stack p={1}>
      <Typography variant="body1" fontWeight="bold">
        Place:
      </Typography>
      <Stack pt={1} spacing={2} component="form" noValidate autoComplete="off">
        <TextField id="place-id" label="ID" value={data.id} />
        <TextField
          id="place-tokens"
          label="Tokens"
          type="number"
          value={data.tokens}
          onChange={handleTokenChange}
        />
      </Stack>
    </Stack>
  );
};

export default PlaceEditor;
