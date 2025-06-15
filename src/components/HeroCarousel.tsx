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
  return <div className="
        relative
        w-[370px] sm:w-[500px] 
        md:w-[760px] lg:w-[840px] xl:w-[950px] 
        mx-auto
      ">
      <div ref={emblaRef} className="
          overflow-hidden rounded-2xl shadow-xl border-2 border-white bg-white
          md:h-[384px] lg:h-[420px] xl:h-[480px]
        " style={{
      // Ensures the container always has the same height as the images, desktop only
      height: "auto"
    }}>
        <div className="flex">
          {carouselProducts.map(product => <div key={product.id} className="
                min-w-0 shrink-0 grow-0 basis-full px-3
                flex items-center justify-center
                h-96
                md:h-[384px] lg:h-[420px] xl:h-[480px]
              ">
              <Link to={`/products/${product.id}`} aria-label={product.name} className="w-full h-full flex items-center justify-center -mx-0 ">
                <img src={product.images[0]} alt={product.name} width="880" height="440" loading="lazy" style={{
              objectFit: "contain",
              // These ensure that on desktop, the image is always centered and same size
              display: "block",
              margin: "0 auto"
            }} className="-bottom-0 h-96 rounded-2xl transition-transform duration-300 bg-white shadow-lg max-w-full max-h-full md:h-[360px] md:w-[680px] lg:h-[390px] lg:w-[760px] xl:h-[440px] xl:w-[880px] object-contain" />
              </Link>
            </div>)}
        </div>
      </div>
    </div>;
};
export default HeroCarousel;