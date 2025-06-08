// client/src/services/api.ts

// Get the base URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define a type for our screen data based on the API response
export interface Screen {
  id: string;
  name: string;
  screenType: string;
}

// Function to fetch all screens
export async function getScreens(): Promise<Screen[]> {
  const response = await fetch(`${API_BASE_URL}/screens`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

// You can add other API functions here, e.g., getTheaters, createReview, etc.
