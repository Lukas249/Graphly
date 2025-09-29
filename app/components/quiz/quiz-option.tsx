interface QuizOptionProps {
  optionNumber: number;
  answer: string;
  selectedAnswer: number;
  finalAnswer: number;
  isCorrect: boolean;
  onAnswerSelected: (optionNumber: number) => void;
  className?: string;
}

const QuizOption = ({
  optionNumber,
  answer,
  selectedAnswer,
  finalAnswer,
  isCorrect,
  onAnswerSelected,
  className = "",
}: QuizOptionProps) => {
  return (
    <div className={className + " relative mt-4 cursor-pointer"}>
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
        className={`block cursor-pointer rounded-lg border border-[#333] bg-[#0f172a] px-4 py-3 text-base text-white transition-colors duration-300 ease-in-out ${
          finalAnswer === -1
            ? selectedAnswer === optionNumber
              ? "bg-primary"
              : ""
            : finalAnswer === optionNumber
              ? isCorrect
                ? "bg-green-600"
                : "bg-primary"
              : isCorrect
                ? "bg-green-600"
                : ""
        }`}
      >
        {answer}
      </label>
    </div>
  );
};

export default QuizOption;
