import { ReviewCard } from "~/components/reviews/ReviewCard";
import type { Route } from "./+types/theatre";
import type { Review, Theatre } from "~/types/types";
import { Link } from "react-router";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const res = await fetch(`${API_BASE_URL}/theatres/${params.theatreId}`);
  const theatre = await res.json();
  const reviews_res = await fetch(
    `${API_BASE_URL}/reviews/${params.theatreId}`
  );
  const reviews = await reviews_res.json();
  console.log(reviews);
  return { theaterInfo: theatre[0], reviews: reviews };
}

export default function Theatre({ loaderData }: Route.ComponentProps) {
  const { theaterInfo, reviews } = loaderData;
  return (
    <div className="max-w-sm m-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl">{theaterInfo.name}</h1>
        <p className="text-sm italic">
          {theaterInfo.city}, {theaterInfo.state}
        </p>
      </div>
      <div>
        {reviews.map((review: Review, i: number) => (
          <ReviewCard review={review} key={i} />
        ))}
      </div>
      <Link
        to={"/"}
        className="transition-colors hover:text-white hover:underline"
      >
        &larr; Home
      </Link>
    </div>
  );
}
