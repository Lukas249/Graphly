import Image from "next/image";
import Menu from "./menu";
import Card from "./components/card";
import AcademicCap from "./icons/academic-cap";
import ChartBar from "./icons/chart-bar";
import CodeBracket from "./icons/code-bracket";

export default function Home() {
  return (
    <div className="home-bg flex flex-col justify-center items-center px-5 pb-8">
      <Menu />
      <div className="flex flex-col h-[80dvh] justify-center items-start gap-5 max-w-5xl w-full">
        <h1 className="text-primary font-bold text-5xl opacity-0 animate-fade-slide-up">Graphly</h1>
        <p className="text-white font-bold text-5xl opacity-0 animation-delay-500 animate-fade-slide-up">Read to understand</p>
        <p className="text-white font-bold text-5xl opacity-0 animation-delay-500 animate-fade-slide-up">Visualize to explore</p>
        <p className="text-white font-bold text-5xl opacity-0 animation-delay-500 animate-fade-slide-up">Solve to master</p>
        <button className="opacity-0 animation-delay-750 animate-fade-slide-up btn">
          Let's Explore
        </button>
      </div>
      <div className="flex flex-row gap-5 max-w-5xl w-full opacity-0 animation-delay-750 animate-fade-slide-up" >
        <Card icon={AcademicCap()} title="Read"  description="Learn core graph concepts and algorithms through well-structured articles, designed to clarify complexity without oversimplifying. Each topic is grounded in real-world relevance and supported by step-by-step explanations."/>
        <Card icon={ChartBar()} title="Visualize"  description="Observe the step-by-step execution of algorithms on graphs, exploring how nodes and edges are processed, decisions are made, and data structures evolve. Engage directly with dynamic, real-time visuals that clarify complex concepts and enhance intuitive learning."/>
        <Card icon={CodeBracket()} title="Solve"  description="Test your understanding with interactive problem sets. Engage with algorithmic challenges that reinforce concepts and encourage deeper learning through experimentation and practice."/>
      </div>
    </div>
  );
}
