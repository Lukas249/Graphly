export default function Accepted({ result, sourceCode } : {result: any, sourceCode: string}) {
    return (
      <>
        <p className="text-green-400 text-2xl my-2 ml-3">{result?.status?.description}</p>
        
        <div className="relative bg-gray-dark-850 rounded-xl p-2">
            <div className="py-2 px-1 border-b-2 border-primary">
                <p>Time: {result?.time * 1000} ms</p>
                <p>Memory: {result?.memory} KB</p>
            </div>

            <p className="py-2 px-1">Submitted code</p>
            <pre className="bg-gray-dark text-gray-100 p-3 rounded-lg">
                {sourceCode}
            </pre>
        </div>
      </>
    )
}