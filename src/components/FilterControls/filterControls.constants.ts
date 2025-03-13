// List of available web performance metrics with their values and display labels
export const metrics = [
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
