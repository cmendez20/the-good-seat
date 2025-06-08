// client/src/queries/useScreens.ts
import { useQuery } from "@tanstack/react-query";
import { getScreens } from "../api";

export function useScreens() {
  return useQuery({
    queryKey: ["screens"], // A unique key for this query
    queryFn: getScreens, // The function that will fetch the data
  });
}
