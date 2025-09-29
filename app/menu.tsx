import Link from "next/link";

export default function Menu() {
  return (
    <nav className="w-full">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between py-4">
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          Graphly
        </span>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col rounded-lg border p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 rtl:space-x-reverse">
            <li>
              <Link
                prefetch={false}
                href="/"
                className="hover:text-primary block bg-transparent px-3 py-2 text-white"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                prefetch={false}
                href="/learn"
                className="hover:text-primary block bg-transparent px-3 py-2 text-white"
              >
                Learn
              </Link>
            </li>
            <li>
              <Link
                prefetch={false}
                href="/visualize"
                className="hover:text-primary block bg-transparent px-3 py-2 text-white"
              >
                Visualize
              </Link>
            </li>
            <li>
              <Link
                prefetch={false}
                href="/solve"
                className="hover:text-primary block bg-transparent px-3 py-2 text-white"
              >
                Solve
              </Link>
            </li>
            <li>
              <Link
                prefetch={false}
                href="/roadmap"
                className="hover:text-primary block bg-transparent px-3 py-2 text-white"
              >
                Roadmap
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
