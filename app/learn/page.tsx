"use server";

import Link from "next/link";
import Menu from "../menu";

const articles = [
  { title: "DFS", path: "/learn/dfs" },
  { title: "BFS", path: "/learn/bfs" },
  { title: "Dijkstra Algorithm - Shortest Path", path: "/learn/dijkstra" },
  {
    title: "Eulerian Path/Cycle",
    path: "/learn/eulerian-path",
  },
  {
    title: "Kosaraju Algorithm - Strongly Connected Components",
    path: "/learn/kosaraju",
  },
];

export default async function LearnPage() {
  return (
    <div className="min-h-screen">
      <Menu />
      <div className="mx-auto my-10 max-w-2xl">
        <h2 className="text-xl">Articles</h2>
        {articles.map((vis) => {
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
