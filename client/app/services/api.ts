import type { Theatre, Screen } from "~/types/types";

// Get the base URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// fetch all screens
export async function getScreens(): Promise<Screen[]> {
  const response = await fetch(`${API_BASE_URL}/screens`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

// fetch all theaters
export async function getTheatres(): Promise<Theatre[]> {
  const response = await fetch(`${API_BASE_URL}/theatres`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
