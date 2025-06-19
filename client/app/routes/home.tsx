import { useState } from "react";
import type { Route } from "./+types/home";
import { Link, redirect } from "react-router";
import ReviewForm from "~/components/reviews/ReviewForm";
import type { Theatre } from "~/types/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The Good Seat" },
    { name: "description", content: "Welcome to The Good Seat!" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const res = await fetch(`${API_BASE_URL}/theatres`);
  const theatres = await res.json();
  return theatres;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const formData = await request.formData();

  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: formData,
    });

    if (!res.ok) {
      // If the API returns an error, you can handle it here
      const errorData = await res.json();
      console.error("API Error:", errorData);
      // You could return the error to display it in the UI
      return { error: errorData.message || "Failed to submit review." };
    }

    // 4. If the POST request is successful, you can return something.
    // A common pattern is to redirect the user.
    console.log("Review submitted successfully!");
    return redirect(`/`); // Redirect to the homepage to see the new state
  } catch (error) {
    console.error("Network or other error:", error);
    return { error: "An unexpected error occurred." };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [showForm, setShowForm] = useState(false);

  const theatres = loaderData;
  if (!theatres) {
    return (
      <>
        <p>No seats reviewed yet.</p>
        <p>Go out and watch some movies!</p>
      </>
    );
  }

  return (
    <div className="max-w-sm m-auto py-8 px-4">
      <h1 className="text-5xl font-bold mb-8 text-center">The Good Seat</h1>
      {theatres.map((theatre: Theatre) => {
        return (
          <Link
            to={`theatres/${theatre.id}`}
            key={theatre.id}
            className="mb-8 block bg-gray-800 text-shadow-white rounded-md p-4 last:mb-16 hover:bg-gray-600 hover:transition-all hover:-translate-y-0.5"
          >
            <div>
              <p>{theatre.name}</p>
              <p className="text-sm italic">
                {theatre.city}, {theatre.state}
              </p>
            </div>
          </Link>
        );
      })}

      <button
        className="bg-sky-600 w-12 h-12 rounded-full flex items-center justify-center text-white text-3xl font-bold transition-colors hover:cursor-pointer hover:bg-sky-400"
        onClick={() => setShowForm(!showForm)}
      >
        {!showForm ? "+" : <span>&times;</span>}
      </button>

      {showForm ? <ReviewForm /> : null}
    </div>
  );
}
