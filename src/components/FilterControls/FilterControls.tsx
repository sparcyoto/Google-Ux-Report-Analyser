import {
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { metrics } from "./filterControls.constants";
/**
 * FilterControls Component
 *
 * This component provides UI controls for filtering and sorting web performance metrics.
 * It allows users to select a specific metric, set a threshold value, and choose a comparison operator.
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter state containing metric, threshold, and operator
 * @param {Function} props.setFilters - Function to update the filters state
 * @param {Object} props.sortConfig - Current sort configuration
 * @param {Function} props.setSortConfig - Function to update the sort configuration
 * @returns {JSX.Element} Filter controls UI
 */
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
  return (
    <Grid container spacing={3}>
      {/* Metric selection dropdown */}
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

      {/* Threshold value input field - disabled if no metric is selected */}
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

      {/* Comparison operator selection - disabled if no metric is selected */}
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
