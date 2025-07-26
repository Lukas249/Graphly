"use client"

import { useState } from 'react'
import { quiz } from './data'
import QuizOption from './quiz-option'

const Quiz = () => {
  const [activeQuestion, setActiveQuestion] = useState<number>(0)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState<boolean>(false)

  const { questions } = quiz
  const { question, choices, explanation } = questions[activeQuestion]

  const onClickNext = () => {
    if(!showExplanation) {
        setShowExplanation(true)
        return 
    }

    setShowExplanation(false)
    setSelectedAnswerIndex(null)

    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1)
    } else {
      setActiveQuestion(0)
    }
  }

  const onAnswerSelected = (answer: string, index: number) => {
    setSelectedAnswerIndex(index)
  }

  const addLeadingZero = (number: number) => (number > 9 ? number : `0${number}`)

  return (
    <div className="mx-auto mt-[50px] max-w-xl rounded-md border border-[#444444] px-[60px] py-[30px]">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-3xl font-medium text-primary">
            {addLeadingZero(activeQuestion + 1)}
          </span>
          <span className="text-xl font-medium text-[#817a8e]">
            /{addLeadingZero(questions.length)}
          </span>
        </div>
      </div>
      <h3 className="my-4 text-xl font-medium text-white">{question}</h3>
      {
      showExplanation && 
      <p>
        Explanation: {explanation}
      </p>
      }
      <form className={showExplanation ? "pointer-events-none" : ""}>
        {choices.map((answer, index) => (
          <QuizOption
            key={answer}
            index={index}
            answer={answer}
            selectedAnswerIndex={selectedAnswerIndex}
            onAnswerSelected={onAnswerSelected}
          />
        ))}
      </form>
      <div className="flex justify-end">
        <button
          onClick={onClickNext}
          disabled={selectedAnswerIndex === null}
          className="mt-12 w-full transform cursor-pointer rounded-lg border border-primary bg-primary px-5 py-1.5 text-base font-semibold text-white outline-none transition duration-300 ease-in-out hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:border-gray-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:hover:scale-100"
        >
          {activeQuestion === questions.length - 1 ? 'Finish' : showExplanation ? 'Next' : "Submit"}
        </button>
      </div>
    </div>
  )
}

export default Quiz