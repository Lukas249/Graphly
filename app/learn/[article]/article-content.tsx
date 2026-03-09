"use client";

import { useEffect, useState } from "react";
import Quiz, { Question } from "@/app/components/quiz/quizCard";
import JsxParser from "react-jsx-parser";
import { Carousel, CarouselSlide } from "@/app/components/carousel/carousel";

import "./styles.css";

export default function ArticleContent({
  title,
  article,
  quizData,
}: {
  title: string;
  article: string;
  quizData: Question[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-base-200 rounded-sm p-8">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>

      <JsxParser
        components={{
          Carousel: Carousel,
          CarouselSlide: CarouselSlide,
        }}
        jsx={article}
      />

      {quizData.length > 0 && <Quiz questions={quizData} />}
    </div>
  );
}
