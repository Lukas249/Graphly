"use client";

import { Children, type ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./style.css";
import Image from "next/image";

type CarouselProps = {
  children?: ReactNode;
  className?: string;
  loop?: boolean;
};

type CarouselSlideProps = {
  slide?: Slide;
};

type Slide = {
  id: number;
  url: string;
  description: string;
};

export function CarouselSlide({ slide }: CarouselSlideProps) {
  return (
    <article>
      <div className="w-full overflow-hidden">
        <Image
          src={slide?.url ?? ""}
          alt={slide?.description ?? "Carousel Slide Image"}
          className="m-auto max-h-full max-w-[60%]"
          width={330}
          height={230}
        />
      </div>

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-sm text-white">{slide?.description}</p>
      </div>
    </article>
  );
}

export function Carousel({ children, className, loop = false }: CarouselProps) {
  const slides = Children.toArray(children).filter((child) => {
    return (child as any)?.type?.name === "CarouselSlide";
  });

  return (
    <div className={`mx-auto w-full max-w-3xl px-4 py-6 ${className}`}>
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={16}
          loop={loop}
          navigation={{
            nextEl: ".carousel-next",
            prevEl: ".carousel-prev",
          }}
          pagination={{
            clickable: true,
            el: ".carousel-pagination",
          }}
          className="carousel-swiper bg-dark overflow-hidden rounded-xl shadow-sm"
        >
          {slides.map((child, idx) => (
            <SwiperSlide key={idx}>{child}</SwiperSlide>
          ))}

          <button
            type="button"
            className="carousel-prev"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            className="carousel-next"
            aria-label="Next slide"
          >
            ›
          </button>
        </Swiper>
      </div>

      <div className="carousel-pagination mt-3 flex w-auto justify-center gap-1" />
    </div>
  );
}
