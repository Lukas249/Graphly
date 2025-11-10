export default function TLE({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <>
      <p className="my-2 ml-3 text-2xl text-red-400">{title}</p>

      <pre className="bg-gray-dark rounded-lg p-3 whitespace-pre-wrap text-gray-100">
        Your solution exceeded the allowed time limit for the test cases. Try to
        write a more optimized solution. {message}
      </pre>
    </>
  );
}
