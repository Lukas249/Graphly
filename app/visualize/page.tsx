import Menu from "../menu";
import GraphDFSEducational from "./GraphDFSEducational.js";

export default function Visualize() {
    return (
        <div className="flex flex-col h-screen">
            <Menu />
            <GraphDFSEducational />
        </div>
    )
}
