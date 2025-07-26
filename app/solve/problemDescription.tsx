export default function ProblemDescription({id, title, description} : {id: number, title: string, description: string}) {
    const htmlString = `<h1 style="font-size:1.5rem">${id}. ${title}</h1>` + description
    
    return (
    <div className="p-5" dangerouslySetInnerHTML={{ __html: htmlString }}></div>
    )
}