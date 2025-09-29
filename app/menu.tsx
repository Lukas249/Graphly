import Link from "next/link";

export default function Menu() {
    return (  
        <nav className="w-full">
            <div className="max-w-5xl flex flex-wrap items-center justify-between mx-auto py-4">
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Graphly</span>
                <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
                    <li>
                        <Link prefetch={false} href="/" className="block py-2 px-3 text-white bg-transparent hover:text-primary">Home</Link>
                    </li>
                    <li>
                        <Link prefetch={false} href="/learn" className="block py-2 px-3 text-white bg-transparent hover:text-primary">Learn</Link>
                    </li>
                    <li>
                        <Link prefetch={false} href="/visualize" className="block py-2 px-3 text-white bg-transparent hover:text-primary">Visualize</Link>
                    </li>
                    <li>
                        <Link prefetch={false} href="/solve" className="block py-2 px-3 text-white bg-transparent hover:text-primary">Solve</Link>
                    </li>
                    <li>
                        <Link prefetch={false} href="/roadmap" className="block py-2 px-3 text-white bg-transparent hover:text-primary">Roadmap</Link>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    )
}