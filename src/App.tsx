import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import "./App.css";
import CruxDataTable from "./components/CruxDataTable/index";
import FilterControls from "./components/FilterControls/index";
import SummaryStats from "./components/SummaryStats/index";
import UrlInputArea from "./components/UrlInputArea/index";

/**
 * Main App component for Chrome UX Report Explorer
 * This application allows users to fetch and analyze Chrome User Experience (CrUX) data
 * for multiple URLs, with filtering, sorting, and comparison capabilities.
 */
function App() {
  // State for managing URLs to be analyzed
  const [urls, setUrls] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");

  // State for API results, loading status, and error handling
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for filtering and sorting data
  const [filters, setFilters] = useState({
    metric: "",
    threshold: "",
    operator: "greaterThan",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  /**
   * Adds a URL to the list if it's valid and not already included
   */
  const handleAddUrl = () => {
    if (inputText && !urls.includes(inputText)) {
      setUrls([...urls, inputText]);
      setInputText("");
    }
  };

  /**
   * Removes a URL from the list
   * @param urlToRemove - The URL to be removed
   */
  const handleRemoveUrl = (urlToRemove: string) => {
    setUrls(urls.filter((url) => url !== urlToRemove));
  };

  /**
   * Fetches CrUX data for all URLs in parallel
   * Uses the Chrome UX Report API to get performance metrics
   */
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

  // Render the application UI
  return (
    <div className="appShell">
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Chrome UX Report Explorer
      </Typography>

      {/* URL Input Section */}
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

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Results Section - Only displayed when results are available */}
      {results.length > 0 && (
        <>
          {/* Filtering and Sorting Controls */}
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

          {/* Summary Statistics - Only displayed for multiple URLs */}
          {urls.length > 1 && (
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Summary Statistics
              </Typography>
              <SummaryStats results={results} />
            </Paper>
          )}

          {/* Data Table Display */}
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
