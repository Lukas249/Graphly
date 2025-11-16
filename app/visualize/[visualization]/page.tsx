"use server";

import AlgorithmWrapper from "./AlgorithmWrapper";
import { notFound } from "next/navigation";
import { getVisualizationBySlug } from "@/app/services/visualizationsService";
import { Visualization } from "@/app/lib/visualizations/types";

interface PageProps {
  params: Promise<{ visualization: string }>;
}

export default async function Visualize({ params }: PageProps) {
  const { visualization } = await params;

  const visualizationData = (await getVisualizationBySlug(
    visualization,
  )) as unknown as Visualization;

  if (!visualizationData) return notFound();

  return <AlgorithmWrapper visualization={visualizationData} />;
}
