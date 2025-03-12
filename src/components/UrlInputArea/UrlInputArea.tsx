import React from "react";
import { Box, TextField, Button, Chip, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function UrlInputArea({
  urls,
  inputText,
  setInputText,
  handleAddUrl,
  handleRemoveUrl,
}: {
  urls: string[];
  inputText: string;
  setInputText: (text: string) => void;
  handleAddUrl: () => void;
  handleRemoveUrl: (url: string) => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddUrl();
    }
  };

  return (
    <Box>
      <Box display="flex" gap={1} mb={2}>
        <TextField
          fullWidth
          label="URL"
          placeholder="https://example.com"
          variant="outlined"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleAddUrl}
          disabled={!inputText}
        >
          Add
        </Button>
      </Box>

      {urls.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {urls.map((url) => (
            <Chip
              key={url}
              label={url}
              onDelete={() => handleRemoveUrl(url)}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default UrlInputArea;
