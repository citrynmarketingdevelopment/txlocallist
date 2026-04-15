"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { SearchBar, BusinessCard } from "@/components";
import styles from "./page.module.css";

/**
 * Client component for search results.
 * Handles state, fetching, and rendering of search results.
 */
export function SearchResultsContent({
  initialQuery = "",
  initialLocation = "",
  initialCategory = "",
  initialPage = 1,
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(initialPage);

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [hasMore, setHasMore] = useState(false);

  // Fetch results
  useEffect(() => {
    fetchResults();
  }, [query, location, category, page]);

  async function fetchResults() {
    if (!query && !location && !category) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (location) params.set("loc", location);
      if (category) params.set("category", category);
      params.set("page", page.toString());

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.data.results);
        setTotal(data.data.total);
        setPageSize(data.data.pageSize);
        setHasMore(data.data.hasMore);

        if (data.data.results.length === 0) {
          setError(
            `No results found. Try a different search or browse all businesses in a city.`
          );
        }
      } else {
        setError(data.error || "Failed to search");
        setResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch({ query: newQuery, location: newLocation }) {
    setQuery(newQuery);
    setLocation(newLocation);
    setPage(1);

    // Update URL
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newLocation) params.set("loc", newLocation);
    router.push(`/search?${params.toString()}`);
  }

  function handlePreviousPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function handleNextPage() {
    if (hasMore) {
      setPage(page + 1);
    }
  }

  return (
    <div className={styles.content}>
      {/* Search Bar */}
      <section className={styles.searchSection}>
        <SearchBar
          variant="inline"
          initialQuery={query}
          initialLocation={location}
          onSubmit={handleSearch}
        />
      </section>

      {/* Results Count */}
      {!isLoading && results.length > 0 && (
        <div className={styles.resultsMeta}>
          <p>
            Found <strong>{total}</strong> result{total !== 1 ? "s" : ""}
            {query && ` for "${query}"`}
            {location && ` in ${location}`}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Searching...</p>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && results.length > 0 && (
        <>
          <div className={styles.resultsGrid}>
            {results.map((business) => (
              <BusinessCard
                key={business.id}
                business={{
                  slug: business.slug,
                  name: business.name,
                  city: business.city.name,
                  description: business.description,
                  price: "$",
                  category:
                    business.categories[0]?.name || "Local Business",
                  imageUrl: business.image?.url || "/placeholder.jpg",
                  imageAlt: business.name,
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {total > pageSize && (
            <div className={styles.pagination}>
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={styles.paginationButton}
              >
                ← Previous
              </button>

              <span className={styles.paginationInfo}>
                Page {page} of {Math.ceil(total / pageSize)}
              </span>

              <button
                onClick={handleNextPage}
                disabled={!hasMore}
                className={styles.paginationButton}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && results.length === 0 && !error && (
        <div className={styles.emptyState}>
          <h2>Start Searching</h2>
          <p>Enter a keyword and city to find local businesses</p>
          <div className={styles.suggestions}>
            <h3>Popular searches:</h3>
            <div className={styles.suggestionChips}>
              {["Austin", "Cafe", "Bakery", "BBQ"].map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    handleSearch({
                      query: s.toLowerCase() === "austin" ? "" : s,
                      location: s.toLowerCase() === "austin" ? s : "",
                    })
                  }
                  className={styles.suggestionChip}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
