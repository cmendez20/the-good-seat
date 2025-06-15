import type { Review } from "~/types/types";

type ReviewProps = { review: Review };

const ReviewCard = ({ review }: ReviewProps) => {
  console.log(review);
  return (
    <div className="p-4 bg-slate-700 mb-8 rounded-xl text-shadow-white relative">
      <p className="mb-4 text-xl">
        {review.screenName} (<span className="italic">{review.screenType}</span>
        )
      </p>
      <p className="mb-4">{review.notes}</p>

      <div className="flex justify-between max-w-48 mx-auto">
        <p className="font-bold tracking-wider">
          🪑 {review.seatRow}
          {review.seatNum}
        </p>
        <p>{review.liked === "yes" ? "😁" : "😡"}</p>
      </div>
    </div>
  );
};

export { ReviewCard };
