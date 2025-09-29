import { JSX } from "react";

export default function Card({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg bg-white px-6 py-8 shadow-xl ring ring-gray-900/5 dark:bg-gray-800">
      <div>
        <span className="bg-primary inline-flex items-center justify-center rounded-md p-2 shadow-lg">
          {icon}
        </span>
      </div>
      <h3 className="mt-5 text-base font-medium tracking-tight text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
