export default function TLE({title, message}: {title: string, message: string}) {
    return (
        <>
            <p className="text-red-400 text-2xl my-2 ml-3">{title}</p>
            
            <pre className="bg-gray-dark text-gray-100 p-3 rounded-lg whitespace-pre-wrap">
                Error: Your solution exceeded allowed time limit for testcases. Try to write optimized solution. {message}
            </pre>
        </>
    )
}