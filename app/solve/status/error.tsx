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

      <div className="bg-gray-dark-850 relative rounded-xl p-2">
        {message && (
          <>
            <p className="px-1 py-2">Execution Message</p>
            <pre className="bg-gray-dark rounded-lg p-3 text-gray-100">
              {message}
            </pre>
          </>
        )}

        {stderr && (
          <>
            <p className="px-1 py-2">Error Output</p>
            <pre className="bg-gray-dark rounded-lg p-3 text-gray-100">
              {stderr}
            </pre>
          </>
        )}

        {compile_output && (
          <>
            <p className="px-1 py-2">Compilation Output</p>
            <pre className="bg-gray-dark rounded-lg p-3 text-gray-100">
              {compile_output}
            </pre>
          </>
        )}
      </div>
    </>
  );
}
