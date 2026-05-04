import AlgorithmWrapper from "./algorithmWrapper";
import { notFound } from "next/navigation";
import { getVisualizationBySlug } from "@/app/services/visualizationsService";
import { Visualization } from "@/app/lib/visualizations/types";

export const revalidate = 86400; // 60 * 60 * 24;

interface PageProps {
  params: Promise<{ visualization: string }>;
}

export async function generateStaticParams() {
  return [];
}

export default async function Visualize({ params }: PageProps) {
  const { visualization } = await params;

  const visualizationData = (await getVisualizationBySlug(
    visualization,
  )) as unknown as Visualization;

  if (!visualizationData) return notFound();

  return <AlgorithmWrapper visualization={visualizationData} />;
}
