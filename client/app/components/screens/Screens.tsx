// client/src/pages/ScreensListPage.tsx
import { useScreens } from "~/services/queries/useScreens";

export default function ScreensListPage() {
  // Use our custom hook to fetch data
  const { data: screens, isLoading, isError, error } = useScreens();

  if (isLoading) {
    return <span>Loading screens...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <h1>All Screens</h1>
      <ul>
        {screens?.map(screen => (
          <li key={screen.id}>
            <strong>{screen.name}</strong> ({screen.screenType})
          </li>
        ))}
      </ul>
    </div>
  );
}
