/**
 * Formats technical metric keys into human-readable names
 *
 * @param metricKey - The raw metric key from CrUX data
 * @returns Formatted, human-readable metric name
 */
export function formatMetricName(metricKey: string): string {
  const metricNames: { [key: string]: string } = {
    first_contentful_paint: "First Contentful Paint",
    largest_contentful_paint: "Largest Contentful Paint",
    first_input_delay: "First Input Delay",
    cumulative_layout_shift: "Cumulative Layout Shift",
    interaction_to_next_paint: "Interaction to Next Paint",
  };

  return metricNames[metricKey] || metricKey;
}

/**
 * Formats metric values with appropriate units based on the metric type
 *
 * @param metric - The metric type
 * @param value - The raw metric value
 * @returns Formatted metric value with appropriate units
 */
export function formatMetricValue(
  metric: string,
  value: number | string
): string {
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
