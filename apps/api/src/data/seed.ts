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
  {
    id: "stay-6",
    title: "Harbor View Flat",
    location: "Sydney, Australia",
    description:
      "A bright top-floor flat overlooking the harbor, a short ferry ride from the city center.",
    images: [
      "https://picsum.photos/seed/lodgical-6a/800/600",
      "https://picsum.photos/seed/lodgical-6b/800/600",
    ],
    pricePerNight: 165,
    maxGuests: 4,
    amenities: ["Wifi", "Balcony", "Air conditioning", "Elevator"],
  },
  {
    id: "stay-7",
    title: "Alpine Chalet",
    location: "Zermatt, Switzerland",
    description:
      "A ski-in/ski-out chalet with a sauna and unobstructed views of the Matterhorn.",
    images: [
      "https://picsum.photos/seed/lodgical-7a/800/600",
      "https://picsum.photos/seed/lodgical-7b/800/600",
    ],
    pricePerNight: 320,
    maxGuests: 8,
    amenities: ["Wifi", "Sauna", "Fireplace", "Ski storage", "Parking"],
  },
  {
    id: "stay-8",
    title: "Rice Terrace Bungalow",
    location: "Ubud, Bali, Indonesia",
    description:
      "An open-air bungalow surrounded by working rice terraces, ten minutes from central Ubud.",
    images: [
      "https://picsum.photos/seed/lodgical-8a/800/600",
      "https://picsum.photos/seed/lodgical-8b/800/600",
    ],
    pricePerNight: 65,
    maxGuests: 2,
    amenities: ["Wifi", "Pool access", "Breakfast included"],
  },
  {
    id: "stay-9",
    title: "Brownstone Suite",
    location: "Brooklyn, New York",
    description:
      "A garden-level suite in a landmarked brownstone, on a quiet tree-lined block near the park.",
    images: [
      "https://picsum.photos/seed/lodgical-9a/800/600",
      "https://picsum.photos/seed/lodgical-9b/800/600",
    ],
    pricePerNight: 245,
    maxGuests: 3,
    amenities: ["Wifi", "Kitchen", "Washer", "Private entrance"],
  },
  {
    id: "stay-10",
    title: "Lakeside Bothy",
    location: "Lake District, England",
    description:
      "A one-room stone bothy on the water's edge, with a rowboat included and no wifi by design.",
    images: [
      "https://picsum.photos/seed/lodgical-10a/800/600",
      "https://picsum.photos/seed/lodgical-10b/800/600",
    ],
    pricePerNight: 110,
    maxGuests: 2,
    amenities: ["Fireplace", "Rowboat", "Parking"],
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
    comment:
      "Stunning house, stairs are steep though — heads up for anyone with mobility concerns.",
    createdAt: "2026-05-28T14:45:00.000Z",
  },
  {
    id: "review-6",
    stayId: "stay-6",
    author: "Noah",
    rating: 5,
    comment: "Watched the ferries go by from bed. Worth every dollar.",
    createdAt: "2026-02-09T08:20:00.000Z",
  },
  {
    id: "review-7",
    stayId: "stay-6",
    author: "Aroha",
    rating: 3,
    comment: "Nice flat but the elevator was out for two of our five nights.",
    createdAt: "2026-06-01T12:00:00.000Z",
  },
  {
    id: "review-8",
    stayId: "stay-7",
    author: "Freddy",
    rating: 5,
    comment:
      "Ski-in/ski-out is not an exaggeration. The sauna after a powder day was unreal.",
    createdAt: "2026-01-18T19:45:00.000Z",
  },
  {
    id: "review-9",
    stayId: "stay-7",
    author: "Elin",
    rating: 4,
    comment:
      "Pricey but the location can't be beat. Book the transfer in advance.",
    createdAt: "2026-02-22T16:10:00.000Z",
  },
  {
    id: "review-10",
    stayId: "stay-8",
    author: "Wayan",
    rating: 5,
    comment: "Fell asleep to frogs and woke up to the terraces in mist. Magic.",
    createdAt: "2026-07-03T07:30:00.000Z",
  },
  {
    id: "review-11",
    stayId: "stay-9",
    author: "Dev",
    rating: 4,
    comment:
      "Classic Brooklyn brownstone charm, quiet block, close to the subway.",
    createdAt: "2026-03-30T11:00:00.000Z",
  },
  {
    id: "review-12",
    stayId: "stay-9",
    author: "Rachel",
    rating: 2,
    comment:
      "Charming but the garden-level windows meant very little natural light.",
    createdAt: "2026-04-11T15:20:00.000Z",
  },
  {
    id: "review-13",
    stayId: "stay-10",
    author: "Oliver",
    rating: 5,
    comment:
      "Exactly the unplugged weekend we wanted. The rowboat made the trip.",
    createdAt: "2026-05-16T09:00:00.000Z",
  },
];
