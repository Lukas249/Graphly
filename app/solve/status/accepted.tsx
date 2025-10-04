import { SubmissionResult } from "../submitCode";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card = ({ title, children, className = "" } : CardProps) => {
  return (
    <div className={`bg-gray-dark rounded-lg p-3 text-white ${className}`}>
      {title && <p className="text-xs pb-1 mb-1 text-primary">{title}</p>}
      <div>{children}</div>
    </div>
  );
};

export default function Accepted({
  result,
  sourceCode,
  feedbackAI
}: {
  result: SubmissionResult;
  sourceCode: string;
  feedbackAI?: string;
}) {
  return (
    <>
      <p className="my-2 ml-3 text-2xl text-green-400">
        {result.status.description}
      </p>

      <div className="bg-gray-dark-850 relative rounded-xl p-2">
        <div className="px-1 py-2">
          <p>Time: {result.time * 1000} ms</p>
          <p>Memory: {result.memory} KB</p>
        </div>

        <div className="space-y-3">
          <Card title="Submitted code">
            <pre>
              {sourceCode}
            </pre>
          </Card>

          { feedbackAI && 
            <Card title="Feedback AI">
              <p>{feedbackAI}</p>
            </Card>
          }
        </div>
      </div>
    </>
  );
}
