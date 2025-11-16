import { LinkTemplates } from "./types";
import { difficultyColors } from "@/app/lib/problems/difficulty-colors";

export const linkTemplates: LinkTemplates = {
  learn(data) {
    return <span>{data.title}</span>;
  },
  visualize(data) {
    return this.learn(data);
  },
  solve(data) {
    return (
      <>
        <p>
          {data.id}. {data.title}
        </p>
        <span
          style={{
            color: difficultyColors[data.difficulty],
          }}
        >
          {data.difficulty}
        </span>
      </>
    );
  },
};
