"use server";

import Link from "next/link";
import Menu from "../menu";
import { notFound } from "next/navigation";
import { fetchAllVisualizations } from "../lib/visualizations/visualizations";

export default async function VisualizePage() {
  const visualizationData = await fetchAllVisualizations();

  if (!visualizationData) return notFound();

  return (
    <div className="min-h-screen">
      <Menu />
      <div className="mx-auto my-10 max-w-2xl">
        <h2 className="text-xl">Visualizations</h2>
        {visualizationData.map((vis) => {
          return (
            <Link
              key={vis.id}
              href={"visualize/" + vis.slug}
              prefetch={false}
              className="cursor-pointer"
            >
              <div className="bg-gray-dark hover:border-primary my-2 flex h-10 items-center justify-between rounded-lg px-4 hover:border-2">
                <span>{vis.title}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
