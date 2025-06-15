const ReviewCard = ({ review }) => {
  return (
    <div className="p-4 bg-slate-200 mb-6 rounded-xl text-black relative">
      <p className="font-bold mb-2">
        {review.title} ({review.screenType})
      </p>
      <p className="mb-2">{review.body}</p>
      <div className="mb-6">
        <p>View: {review.viewRating}</p>
        <p>Comfort: {review.comfortRating}</p>
        <p>Sound: {review.soundRating}</p>
      </div>

      <p className="absolute bottom-0">
        🪑 {review.seatRow}
        {review.seatNum}
      </p>
      <p className="absolute right-5 bottom-0">
        Auditorium {review.screenName}
      </p>
    </div>
  );
};

export { ReviewCard };
