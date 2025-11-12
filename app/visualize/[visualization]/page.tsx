"use server";

import AlgorithmWrapper from "./AlgorithmWrapper";
import { notFound } from "next/navigation";
import { fetchVisualization } from "@/app/lib/visualizations/visualizations";

interface PageProps {
  params: Promise<{ visualization: string }>;
}

export default async function Visualize({ params }: PageProps) {
  const { visualization } = await params;

  const visualizationData = await fetchVisualization(visualization);

  if (!visualizationData) return notFound();

  return <AlgorithmWrapper visualization={visualizationData} />;
}
