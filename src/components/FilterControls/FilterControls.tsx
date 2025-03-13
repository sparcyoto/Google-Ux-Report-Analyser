import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

function FilterControls({
  filters,
  setFilters,
  sortConfig,
  setSortConfig,
}: {
  filters: any;
  setFilters: any;
  sortConfig: any;
  setSortConfig: any;
}) {
  const metrics = [
    { value: "first_contentful_paint", label: "First Contentful Paint" },
    { value: "largest_contentful_paint", label: "Largest Contentful Paint" },
    // { value: "first_input_delay", label: "First Input Delay" },
    { value: "cumulative_layout_shift", label: "Cumulative Layout Shift" },
    { value: "interaction_to_next_paint", label: "Interaction to Next Paint" },
    { value: "experimental_time_to_first_byte", label: "Time to First Byte" },
    {
      value: "largest_contentful_paint_image_time_to_first_byte",
      label: "LCP Image Time to First Byte",
    },
    {
      value: "largest_contentful_paint_image_element_render_delay",
      label: "LCP Image Element Render Delay",
    },
    {
      value: "largest_contentful_paint_image_resource_load_delay",
      label: "LCP Image Resource Load Delay",
    },
    {
      value: "largest_contentful_paint_image_resource_load_duration",
      label: "LCP Image Resource Load Duration",
    },
    { value: "round_trip_time", label: "Round Trip Time" },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Filter by Metric</InputLabel>
          <Select
            value={filters.metric}
            label="Filter by Metric"
            onChange={(e) => setFilters({ ...filters, metric: e.target.value })}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {metrics.map((metric) => (
              <MenuItem key={metric.value} value={metric.value}>
                {metric.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Threshold Value"
          type="number"
          variant="outlined"
          value={filters.threshold}
          onChange={(e) =>
            setFilters({ ...filters, threshold: e.target.value })
          }
          disabled={!filters.metric}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <FormControl component="fieldset" disabled={!filters.metric}>
          <RadioGroup
            row
            value={filters.operator}
            onChange={(e) =>
              setFilters({ ...filters, operator: e.target.value })
            }
          >
            <FormControlLabel
              value="greaterThan"
              control={<Radio />}
              label="Greater Than"
            />
            <FormControlLabel
              value="lessThan"
              control={<Radio />}
              label="Less Than"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default FilterControls;
