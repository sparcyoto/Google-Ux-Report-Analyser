import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress,
  Divider,
  Alert,
} from "@mui/material";
import CruxDataTable from "./components/CruxDataTable/index";
import UrlInputArea from "./components/UrlInputArea/index";
import FilterControls from "./components/FilterControls/index";
import SummaryStats from "./components/SummaryStats/index";
import "./App.css";

function App() {
  const [urls, setUrls] = useState([]);
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    metric: "",
    threshold: "",
    operator: "greaterThan",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Handle adding a URL
  const handleAddUrl = () => {
    if (inputText && !urls.includes(inputText)) {
      setUrls([...urls, inputText]);
      setInputText("");
    }
  };

  // Handle removing a URL
  const handleRemoveUrl = (urlToRemove) => {
    setUrls(urls.filter((url) => url !== urlToRemove));
  };

  // Handle fetching data
  const handleFetchData = async () => {
    if (urls.length === 0) {
      setError("Please add at least one URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create an array of promises for each URL
      const fetchPromises = urls.map((url) =>
        fetch(
          "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=AIzaSyDqIGrdBqOc5qgkuwpvw4GhtOxFigboKiM",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: url,
            }),
          }
        ).then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error || `Failed to fetch data for ${url}`);
            });
          }
          return response.json();
        })
      );

      // Execute all fetch requests in parallel
      const resultsData = await Promise.all(fetchPromises);

      setResults(resultsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appShell">
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Chrome UX Report Explorer
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Enter URLs to Analyze
        </Typography>

        <UrlInputArea
          urls={urls}
          inputText={inputText}
          setInputText={setInputText}
          handleAddUrl={handleAddUrl}
          handleRemoveUrl={handleRemoveUrl}
        />

        <Box mt={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetchData}
            disabled={loading || urls.length === 0}
            startIcon={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            {loading ? "Fetching Data..." : "Fetch CrUX Data"}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results.length > 0 && (
        <>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Filter & Sort
            </Typography>
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />
          </Paper>

          {urls.length > 1 && (
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Summary Statistics
              </Typography>
              <SummaryStats results={results} />
            </Paper>
          )}

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              CrUX Data Results
            </Typography>
            <CruxDataTable
              results={results}
              filters={filters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />
          </Paper>
        </>
      )}
    </div>
  );
}

export default App;
