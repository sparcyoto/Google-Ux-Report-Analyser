/**
 * Converts technical metric keys to human-readable names
 * @param metricKey - The technical name of the metric
 * @returns Formatted, human-readable metric name
 */
export function formatMetricName(metricKey: string): string {
  const metricNames: Record<string, string> = {
    first_contentful_paint: "First Contentful Paint",
    largest_contentful_paint: "Largest Contentful Paint",
    first_input_delay: "First Input Delay",
    cumulative_layout_shift: "Cumulative Layout Shift",
    interaction_to_next_paint: "Interaction to Next Paint",
    experimental_time_to_first_byte: "Time to First Byte",
    round_trip_time: "Round Trip Time",
  };

  return metricNames[metricKey] || metricKey;
}

/**
 * Formats metric values with appropriate units based on the metric type
 * @param metric - The metric key/name
 * @param value - The numeric value to format
 * @returns Formatted value with appropriate units (seconds, milliseconds, etc.)
 */
export function formatMetricValue(
  metric: string | undefined,
  value: number
): string {
  if (!value) return "N/A";

  switch (metric) {
    case "cumulative_layout_shift":
      return value.toFixed(3);
    case "first_contentful_paint":
    case "largest_contentful_paint":
    case "interaction_to_next_paint":
    case "experimental_time_to_first_byte":
      return `${(value / 1000).toFixed(2)}s`;
    case "first_input_delay":
    case "round_trip_time":
      return `${value.toFixed(0)}ms`;
    default:
      return value.toString();
  }
}
