export type QuizOptionProps = {
  optionNumber: number;
  answer: string;
  selectedAnswer: number;
  answerConfirmed: boolean;
  isCorrect: boolean;
  onAnswerSelected: (optionNumber: number) => void;
};

export function QuizOption({
  optionNumber,
  answer,
  selectedAnswer,
  answerConfirmed,
  isCorrect,
  onAnswerSelected,
}: QuizOptionProps) {
  const getLabelColor = (): string => {
    if (answerConfirmed && isCorrect) {
      return "bg-green-600";
    }

    if (answerConfirmed && optionNumber === selectedAnswer) {
      return "bg-red-600";
    }

    if (optionNumber === selectedAnswer) {
      return "bg-primary";
    }

    return "";
  };

  return (
    <div className="relative mt-4 cursor-pointer">
      <input
        type="radio"
        id={`option-${optionNumber}`}
        name="quiz"
        value={answer}
        checked={selectedAnswer === optionNumber}
        onChange={() => onAnswerSelected(optionNumber)}
        className="hidden"
      />
      <label
        htmlFor={`option-${optionNumber}`}
        className={`${getLabelColor()} block cursor-pointer rounded-lg border border-[#333] bg-[#0f172a] px-4 py-3 text-base text-white transition-colors duration-300 ease-in-out`}
      >
        {answer}
      </label>
    </div>
  );
}
