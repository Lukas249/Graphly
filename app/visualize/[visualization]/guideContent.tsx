import { ArticleParagraph } from "@/app/components/articleParagraph";

export type GuideContentProps = {
  guideText?: string;
  isNodeSelectionEnabled?: boolean;
};

export default function GuideContent({
  guideText,
  isNodeSelectionEnabled = true,
}: GuideContentProps) {
  return (
    <div className="mx-7">
      <ArticleParagraph>
        <p>
          <strong>Graph Modification Guide</strong>
        </p>
        You can freely modify the graph in the Graph tab using the following
        syntax:
        <ul className="list-disc pl-4">
          <li>
            Undirected Edge: To create an undirected edge between vertices, use
            {"  "}
            {<pre className="inline-block">--</pre>}
          </li>
          <li>
            Directed Edge: To create a directed edge between vertices, use
            {"  "}
            {<pre className="inline-block">{"->"}</pre>}
          </li>
          <li>
            Edge Weights: To add a weight to an edge, specify it after a colon
            {"  "}
            {<pre className="inline-block">:</pre>}
          </li>
        </ul>
      </ArticleParagraph>

      <ArticleParagraph>
        <p>
          <strong>Interactive View</strong>
        </p>
        Zoom and move using your mouse or touch. Zoom in to see nodes in detail or zoom out to see the whole graph.
      </ArticleParagraph>

      {isNodeSelectionEnabled && (
        <ArticleParagraph>
          <p>
            <strong>Starting Vertex Selection</strong>
          </p>
          Before running the algorithm, you can select a starting vertex. Simply
          click any node to set it as the starting point.
        </ArticleParagraph>
      )}

      {guideText && (
        <ArticleParagraph>
          <div dangerouslySetInnerHTML={{ __html: guideText }} />
        </ArticleParagraph>
      )}
    </div>
  );
}
