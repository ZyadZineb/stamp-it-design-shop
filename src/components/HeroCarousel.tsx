
import React from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { getFeaturedProducts } from "../data/products"; // Optionally use all products if available

// Use all products for the hero carousel
import { getProductList } from "../data/products"; // If getProductList does not exist, use the appropriate function to get all products.

const products = typeof getProductList === "function" ? getProductList() : getFeaturedProducts();

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
      {products.map(product => (
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
