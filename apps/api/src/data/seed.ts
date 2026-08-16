import type { Review, Stay } from "@lodgical/shared";

export const seedStays: Omit<Stay, "rating" | "reviewCount">[] = [
  {
    id: "stay-1",
    title: "Seaside Cottage",
    location: "Lisbon, Portugal",
    description:
      "A whitewashed cottage two minutes from the beach, with a private patio and morning sun.",
    images: [
      "https://picsum.photos/seed/lodgical-1a/800/600",
      "https://picsum.photos/seed/lodgical-1b/800/600",
    ],
    pricePerNight: 120,
    maxGuests: 4,
    amenities: ["Wifi", "Kitchen", "Patio", "Beach access"],
  },
  {
    id: "stay-2",
    title: "Downtown Loft",
    location: "Berlin, Germany",
    description:
      "An industrial-style loft in Kreuzberg, walking distance to cafes, galleries, and the river.",
    images: [
      "https://picsum.photos/seed/lodgical-2a/800/600",
      "https://picsum.photos/seed/lodgical-2b/800/600",
    ],
    pricePerNight: 95,
    maxGuests: 2,
    amenities: ["Wifi", "Washer", "Workspace"],
  },
  {
    id: "stay-3",
    title: "Mountain Cabin",
    location: "Boulder, Colorado",
    description:
      "A timber cabin at the edge of the forest, with a wood stove and a wraparound deck.",
    images: [
      "https://picsum.photos/seed/lodgical-3a/800/600",
      "https://picsum.photos/seed/lodgical-3b/800/600",
    ],
    pricePerNight: 180,
    maxGuests: 6,
    amenities: ["Wifi", "Fireplace", "Hot tub", "Parking"],
  },
  {
    id: "stay-4",
    title: "Canal House",
    location: "Amsterdam, Netherlands",
    description:
      "A narrow 17th-century canal house, fully restored, with original beams and a rooftop view.",
    images: [
      "https://picsum.photos/seed/lodgical-4a/800/600",
      "https://picsum.photos/seed/lodgical-4b/800/600",
    ],
    pricePerNight: 210,
    maxGuests: 3,
    amenities: ["Wifi", "Kitchen", "Bikes"],
  },
  {
    id: "stay-5",
    title: "Desert Casita",
    location: "Tucson, Arizona",
    description:
      "A quiet adobe casita with a private courtyard, built for stargazing and long, slow mornings.",
    images: [
      "https://picsum.photos/seed/lodgical-5a/800/600",
      "https://picsum.photos/seed/lodgical-5b/800/600",
    ],
    pricePerNight: 85,
    maxGuests: 2,
    amenities: ["Wifi", "Pool access", "Parking"],
  },
];

export const seedReviews: Review[] = [
  {
    id: "review-1",
    stayId: "stay-1",
    author: "Maria",
    rating: 5,
    comment: "Woke up to the sound of waves every morning. Would book again.",
    createdAt: "2026-05-02T10:00:00.000Z",
  },
  {
    id: "review-2",
    stayId: "stay-1",
    author: "Tomás",
    rating: 4,
    comment: "Great location, a little noisy on weekends.",
    createdAt: "2026-06-14T18:30:00.000Z",
  },
  {
    id: "review-3",
    stayId: "stay-2",
    author: "Priya",
    rating: 5,
    comment: "Perfect for a work trip — the desk setup was unexpectedly great.",
    createdAt: "2026-04-20T09:15:00.000Z",
  },
  {
    id: "review-4",
    stayId: "stay-3",
    author: "Jonas",
    rating: 5,
    comment: "The hot tub after a day of hiking was everything.",
    createdAt: "2026-03-11T21:00:00.000Z",
  },
  {
    id: "review-5",
    stayId: "stay-4",
    author: "Lena",
    rating: 4,
    comment: "Stunning house, stairs are steep though — heads up for anyone with mobility concerns.",
    createdAt: "2026-05-28T14:45:00.000Z",
  },
];
