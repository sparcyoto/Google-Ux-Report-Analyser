# Chrome UX Report Explorer

This application allows users to fetch and analyze Chrome User Experience (CrUX) data for multiple URLs, with filtering, sorting, and comparison capabilities.

## Setup and Running Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/crux-explorer.git
cd crux-explorer
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Insights and Recommendations

### Data Insights

- The Chrome UX Report API provides valuable real-world performance metrics collected from actual Chrome users.
- Key metrics include First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP).
- The data is categorized into "Good," "Needs Improvement," and "Poor" based on Google's Core Web Vitals thresholds.
- The 75th percentile values represent the experience for the majority of users.

### Recommendations for Using the Data

1. **Focus on Core Web Vitals**: Prioritize improving LCP, CLS, and INP as these metrics directly impact user experience and SEO.
2. **Compare with Competitors**: Use the tool to benchmark your site against competitors to identify areas for improvement.
3. **Track Trends Over Time**: Regularly check your metrics to ensure performance doesn't degrade with new features.
4. **Segment Analysis**: Pay attention to how metrics differ across different pages of your site.
5. **Address Poor Experiences**: Focus on reducing the percentage of users having "Poor" experiences rather than just improving the average.

## Documentation

### Design

The application follows a component-based architecture using React and Material UI. It's designed to be:

- **User-friendly**: Simple interface for entering URLs and viewing results
- **Flexible**: Supports filtering and sorting of data
- **Comparative**: Allows analysis of multiple URLs simultaneously
- **Visual**: Provides charts for easier data interpretation

### Known Issues

1. The API key is currently hardcoded in the application, which is not secure for production use.
2. Limited error handling for malformed URLs or API rate limiting.
3. No persistence of data between sessions.
4. Limited mobile responsiveness in the data tables.
5. No export functionality for the analyzed data.

### Next Steps

1. **Authentication**: Implement user authentication and secure API key handling.
2. **Data Persistence**: Add local storage or database integration to save analysis sessions.
3. **Enhanced Visualization**: Add more chart types and visualization options.
4. **Trend Analysis**: Implement historical data tracking to show performance changes over time.
5. **Detailed Recommendations**: Provide specific recommendations based on the metrics.
6. **Batch URL Import**: Allow importing URLs from CSV or sitemap files.
7. **PDF/CSV Export**: Add functionality to export reports in various formats.
8. **Custom Metrics**: Allow users to define custom thresholds for metrics.

## Component Documentation

### App (src/App.tsx)

The main container component that orchestrates the application flow. It manages:

- URL input and management
- API data fetching
- State management for results, loading, and errors
- Conditional rendering of different sections based on data availability

### UrlInputArea (src/components/UrlInputArea)

Handles the input and management of URLs to be analyzed:

- Text input for entering URLs
- Add/remove functionality for URLs
- Display of currently added URLs as chips

### FilterControls (src/components/FilterControls)

Provides UI controls for filtering and sorting the CrUX data:

- Metric selection dropdown
- Threshold value input
- Comparison operator selection (greater than/less than)
- Sorting configuration

### SummaryStats (src/components/SummaryStats)

Displays aggregated statistics across all analyzed URLs:

- Bar charts showing distribution of performance categories
- Cards displaying average 75th percentile metrics
- Formatted metric values with appropriate units

Key helper functions:

- `formatMetricName`: Converts technical metric keys to human-readable names
- `formatMetricValue`: Formats metric values with appropriate units

### CruxDataTable (src/components/CruxDataTable)

Presents detailed CrUX data in a sortable and filterable table:

- URL and metric information
- 75th percentile values
- Distribution percentages (Good, Needs Improvement, Poor)
- Sortable columns
- Error handling for failed URL fetches

Helper functions:

- `formatMetricName`: Converts technical metric keys to human-readable names
- `formatMetricValue`: Formats metric values with appropriate units

## Technical Implementation Details

The application uses:

- **React** for UI components and state management
- **Material UI** for styled components and responsive design
- **TypeScript** for type safety
- **Recharts** for data visualization
- **Fetch API** for data retrieval from the Chrome UX Report API

The data flow follows this pattern:

1. User inputs URLs
2. Application fetches data from CrUX API in parallel
3. Results are processed and normalized
4. Data is filtered and sorted based on user preferences
5. Visualizations and tables are rendered with the processed data
