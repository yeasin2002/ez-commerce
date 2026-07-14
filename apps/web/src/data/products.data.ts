import type { Product } from "@/feature/home/ProductCard";

export const BEST_SELLERS: Product[] = [
  {
    id: "bs-1",
    name: "Barcelona 2024/25 Home Jersey",
    team: "FC Barcelona",
    price: 89.99,
    original: 119.99,
    discount: 25,
    image:
      "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
  },
  {
    id: "bs-2",
    name: "AC Milan 2006/07 Away Retro",
    team: "AC Milan",
    price: 74.99,
    original: 99.99,
    discount: 25,
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
  },
  {
    id: "bs-3",
    name: "AC Milan 2006/07 Long Sleeve",
    team: "AC Milan",
    price: 84.99,
    original: 109.99,
    discount: 22,
    image:
      "https://images.unsplash.com/photo-1526232636376-102b0ec5a05d?w=800&q=80",
  },
  {
    id: "bs-4",
    name: "Manchester United 2007/08 Home",
    team: "Man United",
    price: 79.99,
    original: 109.99,
    discount: 27,
    image:
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
  },
];

export const NEW_ARRIVALS: Product[] = [
  {
    id: "na-1",
    name: "Atletico Madrid 2025/26 Third Kit",
    team: "Atlético Madrid",
    price: 94.99,
    original: 119.99,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1614632537190-23e4b62d38e8?w=800&q=80",
    tag: "New",
  },
  {
    id: "na-2",
    name: "Brazil National Team 2026",
    team: "Brazil",
    price: 99.99,
    tag: "Drop",
    image:
      "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80",
  },
  {
    id: "na-3",
    name: "France Away Kit 2026",
    team: "France",
    price: 99.99,
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
  },
  {
    id: "na-4",
    name: "Portugal Home Kit 2026",
    team: "Portugal",
    price: 99.99,
    tag: "Drop",
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
  },
];
