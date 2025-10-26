import Link from "next/link";
import CollapsibleVerticalMenu from "../components/collapsible-vertical-menu";

export default function LearnCollapsibleVerticalMenu() {
  return (
    <div className="sticky top-3 self-start">
      <CollapsibleVerticalMenu>
        <li>
          <details open>
            <summary>Graph Traversal</summary>
            <ul>
              <li>
                <Link href="/learn/dfs" prefetch={false}>
                  DFS
                </Link>
              </li>
              <li>
                <Link href="/learn/bfs" prefetch={false}>
                  BFS
                </Link>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <details open>
            <summary>Graph Shortest Path</summary>
            <ul>
              <li>
                <Link href="/learn/dijkstra" prefetch={false}>
                  Dijkstra
                </Link>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <Link href="/learn/eulerian-path" prefetch={false}>
            Eulerian Path/Cycle
          </Link>
        </li>
        <li>
          <Link href="/learn/kosaraju-scc" prefetch={false}>
            Kosaraju - Strongly Connected Components
          </Link>
        </li>
      </CollapsibleVerticalMenu>
    </div>
  );
}
