import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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

interface SortConfig {
  key: keyof ProcessedDataItem | "";
  direction: "asc" | "desc";
}

interface Filters {
  metric: string;
  threshold: string;
  operator: "greaterThan" | "lessThan";
}

interface CruxDataTableProps {
  results: CruxResult[];
  filters: Filters;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
}

function CruxDataTable({
  results,
  filters,
  sortConfig,
  setSortConfig,
}: CruxDataTableProps) {
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

    return processedData.filter((item) => {
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

// Helper function to format metric names
function formatMetricName(metricKey: string): string {
  const metricNames: { [key: string]: string } = {
    first_contentful_paint: "First Contentful Paint",
    largest_contentful_paint: "Largest Contentful Paint",
    first_input_delay: "First Input Delay",
    cumulative_layout_shift: "Cumulative Layout Shift",
    interaction_to_next_paint: "Interaction to Next Paint",
  };

  return metricNames[metricKey] || metricKey;
}

// Helper function to format metric values
function formatMetricValue(metric: string, value: number | string): string {
  if (value === "N/A") return value;

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  switch (metric) {
    case "cumulative_layout_shift":
      return String(numValue);
    case "first_contentful_paint":
    case "largest_contentful_paint":
    case "interaction_to_next_paint":
      return `${numValue}ms`;
    case "first_input_delay":
      return `${numValue}ms`;
    default:
      return String(value);
  }
}

export default CruxDataTable;
