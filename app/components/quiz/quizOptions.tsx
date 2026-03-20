import { QuizOption } from "@/app/components/quiz/quizOption";

type QuizOptionsProps = {
  answers: string[];
  selectedAnswer: number;
  answerConfirmed: boolean;
  correctAnswer: number;
  onAnswerSelected: (optionNumber: number) => void;
};

export function QuizOptions({
  answers,
  selectedAnswer,
  answerConfirmed,
  correctAnswer,
  onAnswerSelected,
}: QuizOptionsProps) {
  return answers.map((answer, index) => (
    <QuizOption
      key={index}
      optionNumber={index + 1}
      answer={answer}
      selectedAnswer={selectedAnswer}
      onAnswerSelected={onAnswerSelected}
      answerConfirmed={answerConfirmed}
      isCorrect={index + 1 === correctAnswer}
    />
  ));
}
