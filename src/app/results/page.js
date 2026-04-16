import { getCurrentUser, getDashboardPath } from "@/lib/auth/session";
import ResultsExperience from "./ResultsExperience";

export const metadata = {
  title: "Explore | Texas Localist",
  description: "Find local businesses, events, and hidden gems across Texas.",
};

export default async function ResultsPage({ searchParams }) {
  const params = await searchParams;
  const q   = params?.q   ?? "";
  const loc = params?.loc ?? "";

  const user = await getCurrentUser().catch(() => null);
  const dashboardPath = user ? getDashboardPath(user.role) : null;

  return (
    <ResultsExperience
      initialQuery={q}
      initialLocation={loc}
      user={user}
      dashboardPath={dashboardPath}
    />
  );
}
