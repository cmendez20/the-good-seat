import { useQuery } from "@tanstack/react-query";
import { getTheatres } from "../api";

export function useTheatres() {
  return useQuery({
    queryKey: ["theatres"], // A unique key for this query
    queryFn: getTheatres, // The function that will fetch the data
  });
}
