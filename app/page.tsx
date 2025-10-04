import Menu from "./menu";
import Card from "./components/card";
import {
  AcademicCapIcon,
  ChartBarIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="home-bg flex flex-col items-center justify-center px-5 pb-8">
      <Menu />
      <div className="flex h-[80dvh] w-full max-w-5xl flex-col items-start justify-center gap-5">
        <h1 className="text-primary animate-fade-slide-up text-5xl font-bold opacity-0">
          Graphly
        </h1>
        <p className="animation-delay-500 animate-fade-slide-up text-5xl font-bold text-white opacity-0">
          Read to understand
        </p>
        <p className="animation-delay-500 animate-fade-slide-up text-5xl font-bold text-white opacity-0">
          Visualize to explore
        </p>
        <p className="animation-delay-500 animate-fade-slide-up text-5xl font-bold text-white opacity-0">
          Solve to master
        </p>
        <button className="animation-delay-750 animate-fade-slide-up btn opacity-0">
          {"Let's Explore"}
        </button>
      </div>
      <div className="animation-delay-750 animate-fade-slide-up flex w-full max-w-5xl flex-row gap-5 opacity-0">
        <Card
          icon={<AcademicCapIcon className="size-5" />}
          title="Read"
          description="Learn core graph concepts and algorithms through well-structured articles, designed to clarify complexity without oversimplifying. Each topic is grounded in real-world relevance and supported by step-by-step explanations."
        />
        <Card
          icon={<ChartBarIcon className="size-5" />}
          title="Visualize"
          description="Observe the step-by-step execution of algorithms on graphs, exploring how nodes and edges are processed, decisions are made, and data structures evolve. Engage directly with dynamic, real-time visuals that clarify complex concepts and enhance intuitive learning."
        />
        <Card
          icon={<CodeBracketIcon className="size-5" />}
          title="Solve"
          description="Test your understanding with interactive problem sets. Engage with algorithmic challenges that reinforce concepts and encourage deeper learning through experimentation and practice."
        />
      </div>
    </div>
  );
}
