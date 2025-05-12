
import { Product } from '../types';

export const products: Product[] = [
  {
    id: "sirdas-470",
    name: "Sirdas Dater 470",
    brand: "Sirdas",
    model: "470",
    price: 300,
    size: "60x40mm",
    lines: 8,
    colors: ["black", "green", "red", "blue"],
    inkColors: ["blue"],
    images: ["/lovable-uploads/a91604fd-99b9-4812-922f-91e34cf59242.png"],
    description: "Professional self-inking dater stamp with 8 lines of text capacity.",
    featured: true,
    shape: "rectangle"
  },
  {
    id: "kasem-2002",
    name: "Kasem 2002",
    brand: "Kasem",
    model: "2002",
    price: 150,
    size: "18x48mm",
    lines: 5,
    colors: ["blue", "red", "black", "orange"],
    inkColors: ["blue"],
    images: ["/lovable-uploads/07fcf583-5667-4fe6-bac3-7227fc16f88f.png"],
    description: "Compact self-inking stamp with 5 lines of text capacity.",
    featured: true,
    shape: "rectangle"
  },
  {
    id: "shiny-s723",
    name: "Shiny S-723",
    brand: "Shiny",
    model: "S-723",
    price: 180,
    size: "18x48mm",
    lines: 5,
    colors: ["blue", "red", "black"],
    inkColors: ["blue"],
    images: ["/lovable-uploads/f7e49b54-0d15-4494-b93b-c274e1266056.png"],
    description: "High-quality self-inking stamp with 5 lines of text capacity.",
    featured: true,
    shape: "rectangle"
  },
  {
    id: "shiny-s032",
    name: "Shiny S-032",
    brand: "Shiny",
    model: "S-032",
    price: 180,
    size: "32mm",
    lines: 2,
    colors: ["blue", "red", "black", "yellow"],
    inkColors: ["blue"],
    images: ["/lovable-uploads/4860f75e-9a1e-43c9-89b4-448b485c8af2.png"],
    description: "Round self-inking stamp with logo capability and 2 lines of text.",
    featured: true,
    shape: "circle"
  },
  {
    id: "shiny-s042",
    name: "Shiny S-042",
    brand: "Shiny",
    model: "S-042",
    price: 200,
    size: "42mm",
    lines: 4,
    colors: ["blue", "black", "yellow"],
    inkColors: ["blue"],
    images: ["/lovable-uploads/ae1b3e93-30d3-42e7-b6f3-02d21160d651.png"],
    description: "Round self-inking stamp with logo capability and 4 lines of text.",
    shape: "circle"
  },
  {
    id: "wood-round-30",
    name: "Wooden Round Stamp 30mm",
    brand: "Cachets Maroc",
    model: "Round 30",
    price: 85,
    size: "30mm",
    lines: 2,
    colors: ["wood"],
    inkColors: ["black", "blue", "red"],
    images: ["/lovable-uploads/c8a9d444-ab04-44f5-80dd-b196c3b48725.png"],
    description: "Classic wooden round stamp with 2 lines of text and logo capability.",
    shape: "circle"
  },
  {
    id: "wood-2x5",
    name: "Wooden Stamp 2x5",
    brand: "Cachets Maroc",
    model: "2x5",
    price: 85,
    size: "20x50mm",
    lines: 5,
    colors: ["wood"],
    inkColors: ["black", "blue", "red"],
    images: ["/lovable-uploads/172d379b-faeb-429b-a29b-0014eb23a984.png"],
    description: "Classic wooden rectangular stamp with 5 lines of text capacity.",
    shape: "rectangle"
  },
  {
    id: "wood-round-40",
    name: "Wooden Round Stamp 40mm",
    brand: "Cachets Maroc",
    model: "Round 40",
    price: 100,
    size: "40mm",
    lines: 4,
    colors: ["wood"],
    inkColors: ["black", "blue", "red"],
    images: ["/lovable-uploads/945f9bb6-607b-48c9-bd12-0e5c7898510b.png"],
    description: "Classic wooden round stamp with 4 lines of text and logo capability.",
    shape: "circle"
  },
  {
    id: "shiny-s842",
    name: "Shiny S-842",
    brand: "Shiny",
    model: "S-842",
    price: 230,
    size: "42x42mm",
    lines: 4,
    colors: ["blue", "black", "yellow"],
    inkColors: ["blue"],
    images: ["/lovable-uploads/ea1ced20-b49e-4f73-a9e8-8bb7c1244339.png"],
    description: "Premium self-inking stamp with 4 lines of text and logo capability.",
    shape: "square"
  },
  {
    id: "sirdas-206",
    name: "Sirdas 206",
    brand: "Sirdas",
    model: "206",
    price: 250,
    size: "56x33mm",
    lines: 7,
    colors: ["green"],
    inkColors: ["blue"],
    images: ["/lovable-uploads/53ca1f4f-4e7e-4879-ad4b-e665d96511fd.png"],
    description: "Professional self-inking stamp with 7 lines of text capacity.",
    shape: "rectangle"
  },
  {
    id: "shiny-s722",
    name: "Shiny S-722",
    brand: "Shiny",
    model: "S-722",
    price: 150,
    size: "14x38mm",
    lines: 4,
    colors: ["red", "black"],
    inkColors: ["blue"],
    images: ["/lovable-uploads/96fba4bf-cc54-4b59-8b27-7e5776d0b544.png"],
    description: "Compact self-inking stamp with 4 lines of text capacity.",
    shape: "rectangle"
  },
  {
    id: "trodat-4914",
    name: "Trodat Printy 4914",
    brand: "Trodat",
    model: "Printy 4914",
    price: 200,
    size: "64x26mm",
    lines: 7,
    colors: ["red", "green"],
    inkColors: ["blue", "red"],
    images: ["/lovable-uploads/ea0b1c21-c188-4d30-ab58-2b411be021c8.png"],
    description: "Professional self-inking stamp with 7 lines of text capacity.",
    shape: "rectangle"
  }
];

export const getBrandProducts = (brand: string) => {
  return products.filter(product => product.brand.toLowerCase() === brand.toLowerCase());
};

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = () => {
  return products.filter(product => product.featured);
};
