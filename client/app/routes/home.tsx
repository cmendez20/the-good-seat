import { useTheatres } from "../services/queries/useTheatres";
import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "The Good Seat" },
    { name: "description", content: "Welcome to The Good Seat!" },
  ];
}

export default function Home() {
  const { data: theatres, isLoading, isError, error } = useTheatres();

  if (isLoading) {
    return <span>Loading theatres...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!theatres) {
    return (
      <>
        <p>No theatres!</p>
        <p>Go out and watch some movies!</p>
      </>
    );
  }

  return (
    <div>
      <h1>Theatres</h1>
      <ul>
        {theatres.map(theatre => {
          return (
            <li key={theatre.id}>
              <Link to={`theatres/${theatre.id}`}>{theatre.name}</Link>
              <p>
                {theatre.city}, {theatre.state}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
