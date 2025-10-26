import Link from "next/link";
import Menu from "../menu";

const visualizations = [
  { title: "DFS", path: "/visualize/dfs" },
  { title: "BFS", path: "/visualize/bfs" },
  { title: "Dijkstra", path: "/visualize/dijkstra" },
  { title: "Eulerian Path/Cycle", path: "/visualize/eulerian-path" },
  { title: "Kosaraju", path: "/visualize/kosaraju" },
];

export default function VisualizePage() {
  return (
    <div className="min-h-screen">
      <Menu />
      <div className="mx-auto my-10 max-w-2xl">
        <h2 className="text-xl">Visualizations</h2>
        {visualizations.map((vis) => {
          return (
            <Link
              key={vis.title}
              href={vis.path}
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
