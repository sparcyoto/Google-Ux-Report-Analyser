import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  Alert,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { formatMetricName, formatMetricValue } from "./cruxDataTable.helpers";
/**
 * Interface representing raw CrUX API result data
 */
interface CruxResult {
  url: string;
  error?: string;
  data?: {
    record: {
      metrics: {
        [key: string]: {
          histogram?: Array<{
            density: number;
          }>;
          percentiles?: {
            p75: number;
          };
        };
      };
    };
  };
}

/**
 * Interface representing processed and normalized CrUX data for display
 */
interface ProcessedDataItem {
  url: string;
  isError: boolean;
  error?: string;
  metric?: string;
  p75?: number | string;
  good: number;
  needsImprovement: number;
  poor: number;
}

/**
 * Interface for table sorting configuration
 */
interface SortConfig {
  key: keyof ProcessedDataItem | "";
  direction: "asc" | "desc";
}

/**
 * Props for the CruxDataTable component
 */
interface CruxDataTableProps {
  results: CruxResult[];
  filters: Filters;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
}

/**
 * Interface for filtering CrUX data
 */
interface Filters {
  metric: string;
  threshold: string;
  operator: "greaterThan" | "lessThan";
}

/**
 * Component that displays CrUX data in a sortable and filterable table
 *
 * @param results - Array of CrUX API results
 * @param filters - Current filter settings
 * @param sortConfig - Current sort configuration
 * @param setSortConfig - Function to update sort configuration
 */
function CruxDataTable({ results, filters, sortConfig, setSortConfig }: any) {
  // Process and normalize CrUX data
  const processedData = useMemo(() => {
    return results.flatMap((result: any) => {
      if (result.error || !result.record || !result.record.metrics) {
        return [
          {
            url:
              result.urlNormalizationDetails?.normalizedUrl ||
              result.url ||
              "Unknown URL",
            isError: true,
            error: result.error || "No data available",
            good: 0,
            needsImprovement: 0,
            poor: 0,
          },
        ];
      }

      // Extract metrics from CrUX data
      const metrics = result.record.metrics || {};
      const url =
        result.urlNormalizationDetails?.normalizedUrl ||
        result.record?.key?.url ||
        result.url ||
        "Unknown URL";

      return Object.entries(metrics)
        .map(([metricName, metricData]: any) => {
          // Skip non-metric entries like form_factors, navigation_types, etc.
          if (!metricData.histogram && !metricData.percentiles) {
            return null;
          }

          // Extract histogram data
          const histogram = metricData.histogram || [];
          const percentiles = metricData.percentiles || {};

          return {
            url: url,
            metric: metricName,
            p75: percentiles.p75 || "N/A",
            good: histogram[0]?.density || 0,
            needsImprovement: histogram[1]?.density || 0,
            poor: histogram[2]?.density || 0,
            isError: false,
          };
        })
        .filter(Boolean); // Remove null entries
    });
  }, [results]);

  // Apply filters
  const filteredData = useMemo(() => {
    if (!filters.metric || !filters.threshold) {
      return processedData;
    }

    return processedData.filter((item: any) => {
      if (item.isError || item.metric !== filters.metric) {
        return false;
      }

      const threshold = parseFloat(filters.threshold);
      const value =
        typeof item.p75 === "number"
          ? item.p75
          : parseFloat(item.p75 as string);

      if (isNaN(value) || isNaN(threshold)) {
        return false;
      }

      return filters.operator === "greaterThan"
        ? value > threshold
        : value < threshold;
    });
  }, [processedData, filters]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) {
      return filteredData;
    }

    return [...filteredData].sort((a, b) => {
      if (a.isError !== b.isError) {
        return a.isError ? 1 : -1;
      }

      if (a.isError) {
        return 0;
      }

      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // String comparison
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Handle sort request
  const requestSort = (key: keyof ProcessedDataItem) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Render sort indicator
  const getSortDirectionIcon = (key: keyof ProcessedDataItem) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpwardIcon fontSize="small" />
    ) : (
      <ArrowDownwardIcon fontSize="small" />
    );
  };

  if (sortedData.length === 0) {
    return <Alert severity="info">No data matches the current filters.</Alert>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              onClick={() => requestSort("url")}
              style={{ cursor: "pointer" }}
            >
              <Box display="flex" alignItems="center">
                URL {getSortDirectionIcon("url")}
              </Box>
            </TableCell>
            <TableCell
              onClick={() => requestSort("metric")}
              style={{ cursor: "pointer" }}
            >
              <Box display="flex" alignItems="center">
                Metric {getSortDirectionIcon("metric")}
              </Box>
            </TableCell>
            <TableCell
              onClick={() => requestSort("p75")}
              style={{ cursor: "pointer" }}
            >
              <Box display="flex" alignItems="center">
                75th Percentile {getSortDirectionIcon("p75")}
              </Box>
            </TableCell>
            <TableCell
              onClick={() => requestSort("good")}
              style={{ cursor: "pointer" }}
            >
              <Box display="flex" alignItems="center">
                Good {getSortDirectionIcon("good")}
              </Box>
            </TableCell>
            <TableCell
              onClick={() => requestSort("needsImprovement")}
              style={{ cursor: "pointer" }}
            >
              <Box display="flex" alignItems="center">
                Needs Improvement {getSortDirectionIcon("needsImprovement")}
              </Box>
            </TableCell>
            <TableCell
              onClick={() => requestSort("poor")}
              style={{ cursor: "pointer" }}
            >
              <Box display="flex" alignItems="center">
                Poor {getSortDirectionIcon("poor")}
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row: any, index: number) => (
            <TableRow key={`${row.url}-${row.metric || "error"}-${index}`}>
              {row.isError ? (
                <>
                  <TableCell>{row.url}</TableCell>
                  <TableCell colSpan={5}>
                    <Typography color="error">Error: {row.error}</Typography>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{row.url}</TableCell>
                  <TableCell>{formatMetricName(row.metric)}</TableCell>
                  <TableCell>
                    {formatMetricValue(row.metric, row.p75)}
                  </TableCell>
                  <TableCell>{(row.good * 100).toFixed(1)}%</TableCell>
                  <TableCell>
                    {(row.needsImprovement * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell>{(row.poor * 100).toFixed(1)}%</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CruxDataTable;
