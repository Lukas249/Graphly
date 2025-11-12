import Quiz, { Question } from "@/app/components/quiz/quiz-card";

import "./styles.css";

export default function ArticleContent({
  title,
  article,
  quizData,
}: {
  title: string;
  article: string;
  quizData: Question[];
}) {
  return (
    <div className="bg-base-200 rounded-sm p-8">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>

      <div dangerouslySetInnerHTML={{ __html: article }}></div>

      {quizData.length > 0 && <Quiz questions={quizData} />}
    </div>
  );
}
