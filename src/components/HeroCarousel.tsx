
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
    align: "center"
  });

  useEffect(() => {
    if (!emblaApi) return;
    
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="relative w-full mx-auto">
      <div 
        ref={emblaRef} 
        className="overflow-hidden rounded-2xl"
        style={{ 
          backgroundColor: 'transparent',
          filter: 'none',
          backdropFilter: 'none',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div className="flex">
          {carouselProducts.map(product => (
            <div 
              key={product.id} 
              className="min-w-0 shrink-0 grow-0 basis-full flex items-center justify-center p-4"
              style={{ 
                backgroundColor: 'transparent',
                filter: 'none',
                position: 'relative',
                zIndex: 2
              }}
            >
              <Link 
                to={`/products/${product.id}`} 
                aria-label={product.name} 
                className="w-full h-full flex items-center justify-center relative z-10 cursor-pointer"
                style={{
                  position: 'relative',
                  zIndex: 10,
                  display: 'block'
                }}
              >
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="max-w-full max-h-full h-64 md:h-80 lg:h-96 w-auto object-contain rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer" 
                  loading="lazy"
                  style={{ 
                    filter: 'none !important',
                    opacity: '1 !important',
                    backgroundColor: 'transparent',
                    backdropFilter: 'none',
                    WebkitFilter: 'none',
                    imageRendering: 'crisp-edges',
                    position: 'relative',
                    zIndex: 10,
                    pointerEvents: 'auto'
                  }}
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
