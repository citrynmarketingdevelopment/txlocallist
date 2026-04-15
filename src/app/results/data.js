export const featuredGems = [
  {
    name: "Starlight Cafe",
    city: "Austin",
    state: "TX",
    address: "1702 South First St, Austin, TX 78704",
    category: "Bakery",
    price: "$$",
    description: "The best sourdough in the hill country. Family owned since 1974.",
    imageUrl: "https://picsum.photos/seed/cafe/800/600",
  },
  {
    name: "Neon Cowboy",
    city: "Marfa",
    state: "TX",
    address: "117 Highland Ave, Marfa, TX 79843",
    category: "Retail",
    price: "$$$",
    description: "Curated vintage Western wear and desert oddities.",
    imageUrl: "https://picsum.photos/seed/shop/800/600",
  },
  {
    name: "Old Oak BBQ",
    city: "Lockhart",
    state: "TX",
    address: "404 Colorado St, Lockhart, TX 78644",
    category: "Food",
    price: "$",
    description: "Central Texas style brisket smoked for 16 hours.",
    imageUrl: "https://picsum.photos/seed/bbq/800/600",
  },
  {
    name: "Bluebonnet Records",
    city: "Fort Worth",
    state: "TX",
    address: "812 Magnolia Ave, Fort Worth, TX 76104",
    category: "Music",
    price: "$$",
    description: "An indie vinyl shop with listening booths, local pressings, and live sets.",
    imageUrl: "https://picsum.photos/seed/records/800/600",
  },
  {
    name: "South Padre Kite House",
    city: "South Padre Island",
    state: "TX",
    address: "201 Padre Blvd, South Padre Island, TX 78597",
    category: "Outdoors",
    price: "$$",
    description: "Beach gear, breezy apparel, and staff that know every secret shoreline spot.",
    imageUrl: "https://picsum.photos/seed/kites/800/600",
  },
  {
    name: "Cedar Moon Books",
    city: "San Antonio",
    state: "TX",
    address: "927 S Presa St, San Antonio, TX 78210",
    category: "Books",
    price: "$$",
    description: "A cozy indie bookstore with late-night readings and regional zines.",
    imageUrl: "https://picsum.photos/seed/books/800/600",
  },
];

export function buildMapsLink({ name, address, city, state }) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${name} ${address} ${city} ${state}`,
  )}`;
}

export function matchesSearch(gem, searchQuery, locationQuery) {
  const searchableText = [
    gem.name,
    gem.address,
    gem.city,
    gem.state,
    gem.category,
    gem.description,
  ]
    .join(" ")
    .toLowerCase();

  const searchText = searchQuery.trim().toLowerCase();
  const locationText = locationQuery.trim().toLowerCase();

  const passesSearch = !searchText || searchableText.includes(searchText);
  const passesLocation = !locationText || searchableText.includes(locationText);

  return passesSearch && passesLocation;
}
