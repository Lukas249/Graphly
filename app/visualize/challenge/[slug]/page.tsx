import { notFound } from "next/navigation";
import { getVisualizationChallengeBySlug } from "@/app/services/visualizationsService";
import { Visualization } from "@/app/lib/visualizations/types";
import AlgorithmWrapperChallenge from "./algorithmWrapperChallenge";

export const revalidate = 86400; // 60 * 60 * 24;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export default async function ChallengePage({ params }: PageProps) {
  const { slug } = await params;

  const visualizationData = (await getVisualizationChallengeBySlug(
    slug,
  )) as unknown as Visualization;

  if (!visualizationData) {
    return notFound();
  }

  return <AlgorithmWrapperChallenge visualization={visualizationData} />;
}
