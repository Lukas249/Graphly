import CollapsibleVerticalMenu from "../components/collapsible-vertical-menu"

export default function LearnCollapsibleVerticalMenu() {
    return (
        <div className="sticky top-3 self-start">
            <CollapsibleVerticalMenu>
                <li>
                    <details open>
                    <summary>Graph Traversal</summary>
                    <ul>
                        <li><a>DFS</a></li>
                        <li><a>BFS</a></li>
                    </ul>
                    </details>
                </li>
                <li>
                    <details open>
                    <summary>Graph Shortest Path</summary>
                    <ul>
                        <li><a>Dijkstra</a></li>
                        <li><a>Bellman-Ford</a></li>
                        <li><a>A*</a></li>
                    </ul>
                    </details>
                </li>
                <li><a>Topological Sort</a></li>
                <li><a>Eulerian Path/Cycle</a></li>
                <li><a>Kosaraju - Strongly Connected Components</a></li>
            </CollapsibleVerticalMenu>
        </div>
    )
}