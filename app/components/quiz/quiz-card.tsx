"use client";

import { useState } from "react";
import QuizOption from "./quiz-option";

export type Question = {
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
};

const Quiz = ({ questions }: { questions: Question[] }) => {
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [finalAnswer, setFinalAnswer] = useState<number>(-1);

  const { question, answers, explanation, correctAnswer } =
    questions[activeQuestion];

  const onClickNext = () => {
    if (finalAnswer === -1) {
      setFinalAnswer(selectedAnswer);
      return;
    }

    setFinalAnswer(-1);
    setSelectedAnswer(-1);

    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setActiveQuestion(0);
    }
  };

  const onAnswerSelected = (answerNumber: number) => {
    setSelectedAnswer(answerNumber);
  };

  return (
    <div className="mx-auto mt-[50px] max-w-xl rounded-md border border-[#444444] px-[60px] py-[30px]">
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
      <h3 className="my-4 text-xl font-medium text-white">{question}</h3>
      {finalAnswer >= 0 && (
        <p className="border-primary rounded-lg border-1 p-2">{explanation}</p>
      )}
      <form className={finalAnswer >= 0 ? "pointer-events-none" : ""}>
        {answers.map((answer, index) => (
          <QuizOption
            key={index}
            optionNumber={index + 1}
            answer={answer}
            selectedAnswer={selectedAnswer}
            onAnswerSelected={onAnswerSelected}
            finalAnswer={finalAnswer}
            isCorrect={index + 1 === correctAnswer}
          />
        ))}
      </form>
      <div className="flex justify-end">
        <button
          onClick={onClickNext}
          disabled={selectedAnswer === null}
          className="border-primary bg-primary mt-12 w-full transform cursor-pointer rounded-lg border px-5 py-1.5 text-base font-semibold text-white transition duration-300 ease-in-out outline-none hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:border-gray-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:hover:scale-100"
        >
          {activeQuestion === questions.length - 1
            ? "Finish"
            : finalAnswer >= 0
              ? "Next"
              : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
