import { Question } from "./quizCard";

export function QuestionCounter({
  activeQuestion,
  questions,
}: {
  activeQuestion: number;
  questions: Question[];
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-primary text-3xl font-medium">
          {(activeQuestion + 1).toString().padStart(2, "0")}
        </span>
        <span className="text-xl font-medium text-[#817a8e]">
          /{questions.length.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
