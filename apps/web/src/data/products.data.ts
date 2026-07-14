import type { Product } from "@/feature/home/ProductCard";

export const BEST_SELLERS: Product[] = [
  {
    id: "bs-1",
    name: "Barcelona 2024/25 Home Jersey",
    team: "FC Barcelona",
    price: 89.99,
    original: 119.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=800&q=80",
      "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80"
    ],
    description: "The official FC Barcelona 2024/25 Home Jersey. Engineered with ultra-breathable moisture-wicking fabric and styled to match the team's iconic vertical stripes. Perfect for matchdays at Camp Nou or streetwear styling.",
    details: [
      "Dri-FIT technology ensures high moisture absorption and dry comfort.",
      "100% recycled polyester lightweight fabric.",
      "Embroidered club crest and brand logo.",
      "Slim fit design tailored for athletic motion."
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    players: [
      { name: "Patch Only", label: "Patch Only" },
      { name: "Lamine Yamal #19", label: "Lamine Yamal #19" },
      { name: "Raphinha #11", label: "Raphinha #11" }
    ],
    patches: ["Patch (Leave Patch Name At Checkout)", "No Patch"],
    rating: 4.9,
    reviewCount: 382,
    soldCount: 88,
    viewingCount: 26
  },
  {
    id: "bs-2",
    name: "AC Milan 2006/07 Away Retro",
    team: "AC Milan",
    price: 74.99,
    original: 99.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80"
    ],
    description: "Revisit the legendary 2006/07 season with this premium AC Milan Away Retro Jersey. Celebrating their historic Champions League victory in Athens, this jersey is a collector's dream with authentic gold accents and stitched detailing.",
    details: [
      "Authentic retro fit with vintage collared design.",
      "Embroidered classic golden star and club crest.",
      "Breathable double-knit fabric texture.",
      "Premium heat-pressed sponsors."
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    players: [
      { name: "Patch Only", label: "Patch Only" },
      { name: "Kaká #22", label: "Kaká #22" },
      { name: "Maldini #3", label: "Maldini #3" },
      { name: "Pirlo #21", label: "Pirlo #21" }
    ],
    patches: ["UCL 7-Time Winners Patch", "No Patch"],
    rating: 4.8,
    reviewCount: 295,
    soldCount: 54,
    viewingCount: 15
  },
  {
    id: "bs-3",
    name: "AC Milan 2006/07 Long Sleeve",
    team: "AC Milan",
    price: 84.99,
    original: 109.99,
    discount: 22,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80"
    ],
    description: "The long-sleeve version of AC Milan's historic 2006/07 away kit. Designed for colder matchdays, this vintage piece represents elegance and football prestige, complete with ribbed cuffs and official branding.",
    details: [
      "Ribbed long sleeve cuffs for comfort and warmth.",
      "Authentic heavy-grade retro polyester build.",
      "Historically accurate sponsor alignment.",
      "Machine washable retro fabrics."
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    players: [
      { name: "Patch Only", label: "Patch Only" },
      { name: "Kaká #22", label: "Kaká #22" },
      { name: "Inzaghi #9", label: "Inzaghi #9" }
    ],
    patches: ["UCL Athens 2007 Final Patch", "No Patch"],
    rating: 4.9,
    reviewCount: 198,
    soldCount: 39,
    viewingCount: 12
  },
  {
    id: "bs-4",
    name: "Manchester United 2007/08 Home",
    team: "Man United",
    price: 79.99,
    original: 109.99,
    discount: 27,
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80"
    ],
    description: "Relive Cristiano Ronaldo's breakout Ballon d'Or campaign in the legendary 2007/08 Manchester United Home Jersey. Famous for the double-winning Premier League and Champions League season, this kit features the back white stripe and classic red hue.",
    details: [
      "Distinctive vertical white mesh back stripe.",
      "Raised felt club crest and embroidered branding.",
      "Side ventilation inserts.",
      "Lightweight retro styling structure."
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    players: [
      { name: "Patch Only", label: "Patch Only" },
      { name: "Ronaldo #7", label: "Ronaldo #7" },
      { name: "Rooney #10", label: "Rooney #10" },
      { name: "Tevez #32", label: "Tevez #32" }
    ],
    patches: ["Premier League Gold Champions Patch", "UCL Starball Patch", "No Patch"],
    rating: 4.9,
    reviewCount: 512,
    soldCount: 110,
    viewingCount: 45
  }
];

export const NEW_ARRIVALS: Product[] = [
  {
    id: "na-1",
    name: "Atletico Madrid 2025/26 Third Kit",
    team: "Atlético Madrid",
    price: 94.99,
    original: 119.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80"
    ],
    description: "The fresh drop of Atletico Madrid's 2025/26 season. Designed with modern abstract patterns and sustainable performance materials, this third jersey represents speed, precision, and passion.",
    details: [
      "Sustainable design made of 100% recycled fibers.",
      "Advanced cooling technology for professional athletes.",
      "Unique premium color accents.",
      "Official licensed merchandise tag."
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    players: [
      { name: "Patch Only", label: "Patch Only" },
      { name: "Griezmann #7", label: "Griezmann #7" },
      { name: "Alvarez #19", label: "Alvarez #19" }
    ],
    patches: ["La Liga Sleeve Patch", "No Patch"],
    rating: 4.7,
    reviewCount: 42,
    soldCount: 12,
    viewingCount: 8,
    tag: "New"
  },
  {
    id: "na-2",
    name: "Brazil National Team 2026",
    team: "Brazil",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&q=80",
      "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80"
    ],
    description: "The legendary yellow jersey of Seleção. Prepare for the World Cup with the official Brazil 2026 kit, featuring classical green details, jaguar print patterns integrated in the fabric, and the historic 5 stars.",
    details: [
      "Historically authentic yellow and green colors.",
      "Embossed animal print designs celebrating Brazilian heritage.",
      "Dri-FIT ADV elite breathability zones.",
      "Stitched federation badge with 5 championship stars."
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    players: [
      { name: "Patch Only", label: "Patch Only" },
      { name: "Vinicius Jr. #7", label: "Vinicius Jr. #7" },
      { name: "Neymar Jr. #10", label: "Neymar Jr. #10" },
      { name: "Rodrygo #11", label: "Rodrygo #11" }
    ],
    patches: ["FIFA World Cup Qualifiers Patch", "No Patch"],
    rating: 4.9,
    reviewCount: 220,
    soldCount: 95,
    viewingCount: 38,
    tag: "Drop"
  },
  {
    id: "na-3",
    name: "France Away Kit 2026",
    team: "France",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
    ],
    description: "Representing French class and style, the 2026 France Away Kit combines a clean white aesthetic with subtle retro pinstripes representing the colors of the Tricolore. Perfect for street styling or support.",
    details: [
      "Unique Tricolore pinstripe gradient detail.",
      "Large Cockerel logo highlighting legacy.",
      "Lightweight athletic construction.",
      "Made from eco-friendly recycled polyester."
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    players: [
      { name: "Patch Only", label: "Patch Only" },
      { name: "Mbappé #10", label: "Mbappé #10" },
      { name: "Griezmann #7", label: "Griezmann #7" }
    ],
    patches: ["Euro 2024 Sleeve Patch", "FIFA World Champions Badge", "No Patch"],
    rating: 4.8,
    reviewCount: 165,
    soldCount: 45,
    viewingCount: 22,
    tag: "New"
  },
  {
    id: "na-4",
    name: "Portugal Home Kit 2026",
    team: "Portugal",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
      "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80"
    ],
    description: "Portugal's home identity wrapped in deep red and green. Inspired by the nation's naval exploration history, this premium shirt is built for peak performance and represents pride and passion.",
    details: [
      "Deep classic Portugal red with green trim collar.",
      "VaporKnit high-stretch weave.",
      "Heat-transferred crest for low-weight comfort.",
      "Eco-sustainable recycled manufacturing."
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    players: [
      { name: "Patch Only", label: "Patch Only" },
      { name: "Ronaldo #7", label: "Ronaldo #7" },
      { name: "Bruno Fernandes #8", label: "Bruno Fernandes #8" },
      { name: "Bernardo Silva #10", label: "Bernardo Silva #10" }
    ],
    patches: ["Euro 2024 Sleeve Patch", "No Patch"],
    rating: 4.9,
    reviewCount: 310,
    soldCount: 115,
    viewingCount: 52,
    tag: "Drop"
  }
];

export const ALL_PRODUCTS = [...BEST_SELLERS, ...NEW_ARRIVALS];

export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}
