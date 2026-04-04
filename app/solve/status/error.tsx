import "./style.css";

export default function Error({
  title,
  message,
  compile_output,
  stderr,
}: {
  title: string;
  message: string;
  compile_output: string;
  stderr: string;
}) {
  return (
    <>
      <p className="my-2 ml-3 text-2xl text-red-400">{title}</p>

      <div className="relative rounded-xl p-2">
        {message && (
          <>
            <p className="px-1 py-2">Execution Message</p>
            <pre className="result-message">{message}</pre>
          </>
        )}

        {stderr && (
          <>
            <p className="px-1 py-2">Error Output</p>
            <pre className="result-message">{stderr}</pre>
          </>
        )}

        {compile_output && (
          <>
            <p className="px-1 py-2">Compilation Output</p>
            <pre className="result-message">{compile_output}</pre>
          </>
        )}
      </div>
    </>
  );
}
