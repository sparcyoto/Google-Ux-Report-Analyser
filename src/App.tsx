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
import { fetchCruxData } from "./helpers/fetchCruxData";

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

  // console.log("CRUX_API_KEY", process.env.CRUX_API_KEY);

  /**
   * Fetches CrUX data for all URLs in parallel
   * Uses the external fetchCruxData function to get performance metrics
   */
  const handleFetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const resultsData = await fetchCruxData(urls);
      setResults(resultsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders the header section of the application
   */
  const renderHeader = () => (
    <Typography variant="h3" component="h1" gutterBottom align="center">
      Chrome UX Report Explorer
    </Typography>
  );

  /**
   * Renders the URL input section
   */
  const renderUrlInputSection = () => (
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
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Fetching Data..." : "Fetch CrUX Data"}
        </Button>
      </Box>
    </Paper>
  );

  /**
   * Renders error messages if any
   */
  const renderErrorMessage = () =>
    error && (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );

  /**
   * Renders the filter and sort controls
   */
  const renderFilterControls = () => (
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
  );

  /**
   * Renders summary statistics for multiple URLs
   */
  const renderSummaryStats = () =>
    urls.length > 1 && (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Summary Statistics
        </Typography>
        <SummaryStats results={results} />
      </Paper>
    );

  /**
   * Renders the data table with results
   */
  const renderDataTable = () => (
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
  );

  /**
   * Renders the results section when data is available
   */
  const renderResults = () =>
    results.length > 0 && (
      <>
        {renderFilterControls()}
        {renderSummaryStats()}
        {renderDataTable()}
      </>
    );

  // Render the application UI
  return (
    <div className="appShell">
      {renderHeader()}
      {renderUrlInputSection()}
      {renderErrorMessage()}
      {renderResults()}
    </div>
  );
}

export default App;
