
import React from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { products, getFeaturedProducts } from "../data/products";

// Use all products for the hero carousel
// If you want only featured products, use getFeaturedProducts() instead
// Here, use `products` array for all products
const carouselProducts = products;

const HeroCarousel: React.FC = () => (
  <Carousel
    opts={{
      align: "center",
      loop: true,
      skipSnaps: true,
      dragFree: true,
    }}
    className="w-[350px] sm:w-[410px] md:w-[430px] mx-auto"
  >
    <CarouselContent>
      {carouselProducts.map(product => (
        <CarouselItem key={product.id}>
          <Link to={`/products/${product.id}`} aria-label={product.name}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-72 object-contain rounded-xl shadow-lg border-4 border-white bg-white hover:scale-105 transition-transform duration-200"
              style={{ maxHeight: 320 }}
              width="430"
              height="320"
              loading="lazy"
            />
          </Link>
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
);

export default HeroCarousel;
