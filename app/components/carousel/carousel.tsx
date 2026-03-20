"use client";

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./style.css";
import {
  CarouselSlide,
  type CarouselSlideProps,
} from "@/app/components/carousel/carouselSlide";

type CarouselProps = {
  children?: ReactNode;
  className?: string;
  loop?: boolean;
};

export function Carousel({ children, className, loop = false }: CarouselProps) {
  const slides = Children.toArray(children).filter(
    (
      child,
    ): child is ReactElement<CarouselSlideProps, typeof CarouselSlide> => {
      return isValidElement(child) && child.type === CarouselSlide;
    },
  );

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
