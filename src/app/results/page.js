import ResultsExperience from "./ResultsExperience";

export const metadata = {
  title: "Explore | Texas Localist",
  description: "Find local businesses, events, and hidden gems across Texas.",
};

/**
 * /results — the retro-styled explore + search page.
 * Renders ResultsExperience which calls /api/search for real results
 * and shows the EventsSection beneath.
 */
export default async function ResultsPage({ searchParams }) {
  const params = await searchParams;
  const q   = params?.q   ?? "";
  const loc = params?.loc ?? "";

  return <ResultsExperience initialQuery={q} initialLocation={loc} />;
}
