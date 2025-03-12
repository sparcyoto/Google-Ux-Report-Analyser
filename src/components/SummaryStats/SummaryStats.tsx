import React, { useMemo } from "react";
import { Grid, Card, CardContent, Typography, Divider } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface CruxResult {
  url: string;
  error?: string;
  data?: {
    record: {
      metrics: {
        [key: string]: {
          percentiles?: {
            p75: number;
          };
          histogram?: Array<{
            density: number;
          }>;
        };
      };
    };
  };
}

interface MetricSummary {
  name: string;
  p75Values: number[];
  goodValues: number[];
  needsImprovementValues: number[];
  poorValues: number[];
}

interface ChartDataItem {
  name: string;
  metricKey: string;
  avgP75: number;
  avgGood: number;
  avgNeedsImprovement: number;
  avgPoor: number;
}

interface SummaryStatsProps {
  results: CruxResult[];
}

function SummaryStats({ results }: SummaryStatsProps) {
  // Calculate summary statistics from the results
  const summaryData = useMemo(() => {
    const validResults = results.filter(
      (result) => !result.error && result.data
    );
    if (validResults.length === 0) return null;

    const metricSummaries: Record<string, MetricSummary> = {};

    validResults.forEach((result) => {
      const metrics = result.data!.record.metrics || {};

      Object.entries(metrics).forEach(([metricName, metricData]) => {
        if (!metricSummaries[metricName]) {
          metricSummaries[metricName] = {
            name: formatMetricName(metricName),
            p75Values: [],
            goodValues: [],
            needsImprovementValues: [],
            poorValues: [],
          };
        }

        const summary = metricSummaries[metricName];
        const percentiles = metricData.percentiles || {};
        const histogram = metricData.histogram || [];

        if (percentiles.p75) {
          summary.p75Values.push(percentiles.p75);
        }

        summary.goodValues.push(histogram[0]?.density || 0);
        summary.needsImprovementValues.push(histogram[1]?.density || 0);
        summary.poorValues.push(histogram[2]?.density || 0);
      });
    });

    // Calculate averages and prepare chart data
    const chartData: ChartDataItem[] = [];

    Object.entries(metricSummaries).forEach(([metricName, summary]) => {
      const avgP75 =
        summary.p75Values.length > 0
          ? summary.p75Values.reduce((sum, val) => sum + val, 0) /
            summary.p75Values.length
          : 0;

      const avgGood =
        summary.goodValues.length > 0
          ? summary.goodValues.reduce((sum, val) => sum + val, 0) /
            summary.goodValues.length
          : 0;

      const avgNeedsImprovement =
        summary.needsImprovementValues.length > 0
          ? summary.needsImprovementValues.reduce((sum, val) => sum + val, 0) /
            summary.needsImprovementValues.length
          : 0;

      const avgPoor =
        summary.poorValues.length > 0
          ? summary.poorValues.reduce((sum, val) => sum + val, 0) /
            summary.poorValues.length
          : 0;

      chartData.push({
        name: summary.name,
        metricKey: metricName,
        avgP75: avgP75,
        avgGood: avgGood * 100,
        avgNeedsImprovement: avgNeedsImprovement * 100,
        avgPoor: avgPoor * 100,
      });
    });

    return chartData;
  }, [results]);

  if (!summaryData || summaryData.length === 0) {
    return (
      <Typography variant="body1">
        No valid data available for summary statistics.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Average Performance Across All URLs
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Distribution of Performance Categories (%)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summaryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === "avgP75") {
                      const metric = summaryData.find((d) => d.name === name);
                      return formatMetricValue(metric?.metricKey, value);
                    }
                    return [`${value.toFixed(1)}%`, name.replace("avg", "")];
                  }}
                />
                <Legend />
                <Bar dataKey="avgGood" name="Good" fill="#4caf50" />
                <Bar
                  dataKey="avgNeedsImprovement"
                  name="Needs Improvement"
                  fill="#ff9800"
                />
                <Bar dataKey="avgPoor" name="Poor" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          75th Percentile Metrics (Average)
        </Typography>
        <Grid container spacing={2}>
          {summaryData.map((metric) => (
            <Grid item xs={12} sm={6} md={4} key={metric.name}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {metric.name}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatMetricValue(metric.metricKey, metric.avgP75)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

// Helper function to format metric names
function formatMetricName(metricKey: string): string {
  const metricNames: Record<string, string> = {
    first_contentful_paint: "First Contentful Paint",
    largest_contentful_paint: "Largest Contentful Paint",
    first_input_delay: "First Input Delay",
    cumulative_layout_shift: "Cumulative Layout Shift",
    interaction_to_next_paint: "Interaction to Next Paint",
  };

  return metricNames[metricKey] || metricKey;
}

// Helper function to format metric values
function formatMetricValue(metric: string | undefined, value: number): string {
  if (!value) return "N/A";

  switch (metric) {
    case "cumulative_layout_shift":
      return value.toFixed(3);
    case "first_contentful_paint":
    case "largest_contentful_paint":
    case "interaction_to_next_paint":
      return `${(value / 1000).toFixed(2)}s`;
    case "first_input_delay":
      return `${value.toFixed(0)}ms`;
    default:
      return value.toString();
  }
}

export default SummaryStats;
