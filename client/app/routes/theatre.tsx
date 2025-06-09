import type { Route } from "./+types/theatre";
import type { Theatre } from "~/types/types";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const res = await fetch(`${API_BASE_URL}/theatres/${params.theatreId}`);
  const theatre = await res.json();
  console.log(theatre);
  return theatre[0];
}

export default function Theatre({ loaderData }: Route.ComponentProps) {
  const { name, city, state } = loaderData;
  return (
    <>
      <h1 style={{ color: "red", fontSize: "24px" }}>{name}</h1>
      <p>{city}</p>
      <p>{state}</p>
    </>
  );
}
