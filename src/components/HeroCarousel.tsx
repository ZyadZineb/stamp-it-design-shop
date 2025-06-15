
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { products } from "../data/products";

const carouselProducts = products;

const HeroCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: true,
    dragFree: true,
    align: "center",
  });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 2000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="relative w-[370px] sm:w-[500px] md:w-[680px] mx-auto">
      <div ref={emblaRef} className="overflow-hidden rounded-2xl shadow-xl border-2 border-white bg-white">
        <div className="flex">
          {carouselProducts.map(product => (
            <div
              key={product.id}
              className="min-w-0 shrink-0 grow-0 basis-full px-3 flex items-center justify-center h-96"
            >
              <Link to={`/products/${product.id}`} aria-label={product.name} className="w-full h-full flex items-center justify-center">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-96 object-contain rounded-2xl transition-transform duration-300 bg-white shadow-lg max-w-full max-h-full"
                  width="660"
                  height="384"
                  loading="lazy"
                  style={{ objectFit: "contain" }}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;

