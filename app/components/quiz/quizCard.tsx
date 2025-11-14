"use client";

import { useState } from "react";
import { QuizOptions } from "./quizOptions";
import SubmitButton from "./button";
import { Explanation } from "./explanation";
import { QuestionCounter } from "./questionCounter";

export type Question = {
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
};

const Quiz = ({ questions }: { questions: Question[] }) => {
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [answerConfirmed, setAnswerConfirmed] = useState<boolean>(false);

  const { question, answers, explanation, correctAnswer } =
    questions[activeQuestion];

  const onClickNext = () => {
    if (!answerConfirmed) {
      setAnswerConfirmed(true);
      return;
    }

    setAnswerConfirmed(false);
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

  const getButtonText = () => {
    if (activeQuestion === questions.length - 1 && answerConfirmed) {
      return "Finish";
    } else if (answerConfirmed) {
      return "Next";
    }

    return "Submit";
  };

  return (
    <div className="mx-auto mt-[50px] max-w-xl rounded-md border border-[#444444] px-[60px] py-[30px]">
      <QuestionCounter activeQuestion={activeQuestion} questions={questions} />

      <h3 className="my-4 text-xl font-medium text-white">{question}</h3>

      {answerConfirmed && <Explanation text={explanation} />}

      <form className={answerConfirmed ? "pointer-events-none" : ""}>
        <QuizOptions
          answers={answers}
          correctAnswer={correctAnswer}
          answerConfirmed={answerConfirmed}
          onAnswerSelected={onAnswerSelected}
          selectedAnswer={selectedAnswer}
        />
      </form>
      <div className="flex justify-end">
        <SubmitButton
          onClickHandler={onClickNext}
          disabled={selectedAnswer < 0}
          text={getButtonText()}
        />
      </div>
    </div>
  );
};

export default Quiz;
