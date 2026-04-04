import Link from "next/link";

const linkClass =
  "hover:text-primary block bg-transparent px-3 py-2 text-white";

export default function Menu() {
  return (
    <nav className="w-full">
      <div className="max-w-menu mx-auto flex flex-wrap items-center justify-between p-4">
        <span className="self-center text-2xl font-semibold whitespace-nowrap">
          Graphly
        </span>
        <div className="block w-auto">
          <ul className="mt-0 flex flex-row space-x-8 rounded-lg border-0 p-0 font-medium rtl:space-x-reverse">
            <li>
              <Link prefetch={false} href="/" className={linkClass}>
                Home
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/learn" className={linkClass}>
                Learn
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/visualize" className={linkClass}>
                Visualize
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/solve" className={linkClass}>
                Solve
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/quest" className={linkClass}>
                Quest
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/roadmap" className={linkClass}>
                Roadmap
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
