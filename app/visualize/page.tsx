"use server";

import Menu from "../menu";
import { notFound } from "next/navigation";
import { LinkList } from "../components/linkList/linkList";
import { getVisualizations } from "../services/visualizationsService";

export default async function VisualizePage() {
  const visualizations = await getVisualizations({
    id: true,
    title: true,
    slug: true,
  });

  if (!visualizations) return notFound();

  return (
    <div className="min-h-screen">
      <Menu />
      <div className="mx-auto my-10 max-w-2xl">
        <h2 className="text-xl">Visualizations</h2>
        <LinkList
          links={visualizations}
          prefetch={false}
          slugPrefix="visualize/"
          linkType="visualize"
        />
      </div>
    </div>
  );
}
