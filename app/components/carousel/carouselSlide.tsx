import Image from "next/image";

export type Slide = {
  id: number;
  url: string;
  description: string;
};

export type CarouselSlideProps = {
  slide?: Slide;
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
