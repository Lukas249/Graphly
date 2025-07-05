interface QuizOptionProps {
  index: number
  answer: string
  selectedAnswerIndex: number | null
  onAnswerSelected: (answer: string, index: number) => void
}

const QuizOption: React.FC<QuizOptionProps> = ({
  index,
  answer,
  selectedAnswerIndex,
  onAnswerSelected,
}) => {
  return (
    <div className="relative mt-4 cursor-pointer">
      <input
        type="radio"
        id={`choice-${index}`}
        name="quiz"
        value={answer}
        checked={selectedAnswerIndex === index}
        onChange={() => onAnswerSelected(answer, index)}
        className="hidden"
      />
      <label
        htmlFor={`choice-${index}`}
        className={`block cursor-pointer rounded-lg border border-[#333] bg-[#0f172a] px-4 py-3 text-lg text-white transition-colors duration-300 ease-in-out ${
          selectedAnswerIndex === index ? 'border-[#2f459c] bg-primary' : ''
        }`}
      >
        {answer}
      </label>
    </div>
  )
}

export default QuizOption