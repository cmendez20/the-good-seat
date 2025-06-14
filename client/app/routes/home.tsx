import type { Route } from "./+types/home";
import { Form, Link } from "react-router";

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
  console.log(theatres);
  return theatres;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  let formData = await request.formData();
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
      <h1 className="text-4xl font-bold mb-4 text-center">The Good Seat</h1>
      <ul>
        {theatres.map(theatre => {
          return (
            <div className="mb-4 bg-gray-800 text-shadow-white rounded-md p-4 hover:bg-slate-500 hover:transition-all hover:-translate-y-0.5">
              <li key={theatre.id}>
                <Link to={`theatres/${theatre.id}`}>{theatre.name}</Link>
                <p className="text-sm italic">
                  {theatre.city}, {theatre.state}
                </p>
              </li>
            </div>
          );
        })}
      </ul>

      <h2 className="text-2xl font-bold mb-4 text-center">Add new Review</h2>
      {/* 
      Theathre Name: AMC NorthPark 15
      Theatre Type: Dolby, IMAX, DIGITAL
      Auditorium #:
      Seat Row:
      Seat Num: 
      Notes:
      Would i seat there again?
      Image:

      */}
      <Form method="post" className="grid gap-4 max-w-72 mx-auto">
        <input
          type="text"
          name="theatre_name"
          className="bg-amber-50 rounded py-1 px-2 text-black"
          placeholder="Theatre Name"
        />
        <input
          type="text"
          name="theatre_name"
          className="bg-amber-50 rounded py-1 px-2 text-black"
          placeholder="Theatre Name"
        />
        <button
          type="submit"
          className="bg-slate-700 rounded p-4 py-2 max-w-min mx-auto hover:cursor-pointer hover:bg-slate-500 hover:transition-colors"
        >
          Submit
        </button>
      </Form>
    </div>
  );
}
