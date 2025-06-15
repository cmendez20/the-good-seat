import { ReviewCard } from "~/components/reviews/ReviewCard";
import type { Route } from "./+types/theatre";
import type { Theatre } from "~/types/types";

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
    <div className="max-w-2xl m-auto pt-8">
      <div className="mb-6">
        <h1 className="text-2xl">{theaterInfo.name}</h1>
        <p className="text-sm italic">
          {theaterInfo.city}, {theaterInfo.state}
        </p>
      </div>

      <div>
        {reviews.map((review, i) => (
          <ReviewCard review={review} key={i} />
        ))}
      </div>
    </div>
  );
}
