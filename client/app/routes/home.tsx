import type { Route } from "./+types/home";
import { Link } from "react-router";
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
  let formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log(data);
  // let title = formData.get("title");
  // let project = await someApi.updateProject({ title });
  // return project;
}

export default function Home({ loaderData }: Route.ComponentProps) {
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
      <ReviewForm />
    </div>
  );
}
