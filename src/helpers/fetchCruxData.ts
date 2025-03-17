/**
 * Fetches CrUX data for given URLs from the Chrome UX Report API
 * @param urls - Array of URLs to fetch data for
 * @returns Promise resolving to the fetched data or error
 */
export const fetchCruxData = async (urls: string[]) => {
  if (urls.length === 0) {
    throw new Error("Please add at least one URL");
  }

  // Create an array of promises for each URL
  const fetchPromises = urls.map((url) =>
    fetch(
      `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${
        import.meta.env.VITE_CRUX_API_KEY
      }`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
        }),
      }
    ).then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.error || `Failed to fetch data for ${url}`);
        });
      }
      return response.json();
    })
  );

  // Execute all fetch requests in parallel
  return Promise.all(fetchPromises);
};
