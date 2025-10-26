import "./problemDescription.css";

export default function ProblemDescription({
  id,
  title,
  description,
}: {
  id: number;
  title: string;
  description: string;
}) {
  const htmlString = `<h1 class="title">${id}. ${title}</h1>` + description;

  return (
    <div
      className="problemDescription"
      dangerouslySetInnerHTML={{ __html: htmlString }}
    ></div>
  );
}
