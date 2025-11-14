type QuizOptionProps = {
  optionNumber: number;
  answer: string;
  selectedAnswer: number;
  answerConfirmed: boolean;
  isCorrect: boolean;
  onAnswerSelected: (optionNumber: number) => void;
};

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
    } else if (answerConfirmed && optionNumber === selectedAnswer) {
      return "bg-red-600";
    } else if (optionNumber === selectedAnswer) {
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
