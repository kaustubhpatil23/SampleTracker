import axios from "axios";

export const fetchTrackingData = async (trackingNumber) => {
  try {
    // Replace with your published Google Sheets CSV URL
    const sheetURL =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQFAVZi2eLE-Yq2AlO-P_NIpBZ0fQ5cOzwazZxWrcLy2m4cSj8qyu85vOWOQL-CMqQm-xFuuEzRUZ1c/pub?output=csv";
    const response = await axios.get(sheetURL);

    // Parse CSV data
    const rows = response.data.split("\n").slice(1); // Skip header row

    for (const row of rows) {
      // Split row while handling quoted commas in fields
      const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      if (columns.length >= 7) {
        const [
          trackingNum,
          refNo,
          origin,
          destination,
          bookedOn,
          status,
          historyJson,
        ] = columns.map((col) => col.trim().replace(/^"|"$/g, ""));

        if (trackingNum === trackingNumber) {
          try {
            // Fix JSON formatting and parse
            const cleanJson = historyJson
              .replace(/""/g, '"') // Fix double-escaped quotes
              .replace(/^"|"$/g, ""); // Remove surrounding quotes

            const history = JSON.parse(cleanJson);

            return {
              trackingNumber: trackingNum,
              refNo,
              origin,
              destination,
              bookedOn,
              status,
              history,
            };
          } catch (error) {
            console.error("Error parsing history JSON:", error);
            return {
              trackingNumber: trackingNum,
              refNo,
              origin,
              destination,
              bookedOn,
              status,
              history: [], // Fallback empty array
            };
          }
        }
      }
    }
    return null; // Tracking number not found
  } catch (error) {
    console.error("Failed to fetch tracking data:", error);
    throw error; // Re-throw for handling in components
  }
};
