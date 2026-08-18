import type { Review, Stay } from "@lodgical/shared";

export const seedStays: Omit<Stay, "rating" | "reviewCount">[] = [
  {
    id: "stay-1",
    title: "Seaside Cottage",
    location: "Lisbon, Portugal",
    description:
      "A whitewashed cottage two minutes from the beach, with a private patio and morning sun.",
    images: [
      "https://images.unsplash.com/photo-1510069551606-f9ec0a62fe28?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1686950429623-abb1ef6ea8e8?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1643335125507-c99b6f2414d3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585492197563-572494c5ff0f?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1637687222430-ca092fb9062a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1602331407936-58a39a558710?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1583295125721-766a0088cd3f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519475889208-0968e5438f7d?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1738208400122-e7d246b226ae?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1695182622851-a755066e9d89?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1605578460278-14a28bf273b4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1746891522750-254688aeceb2?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1773529393844-879b068218db?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1623451680386-0bb3ab60a8ff?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1569881347427-c861051db3f9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1652407782575-3f5805f9d220?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1698248476376-f28f8869b622?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1641217658611-5ffbcde46b61?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1693639283363-eaca2875819d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1639422817663-a6caef81d114?w=800&h=600&fit=crop",
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
