import Image from "next/image";
import { ArticleParagraph, VisualizationImageWithStep } from "../page";
import Quiz from "@/app/components/quiz/quiz-card";
import { quizDFS } from "./quizData";

const imagesData = [
  {
    src: "/images/graph/undirected_graph.jpg",
    alt: "DFS - Undirected Graph  - Step 1",
  },
  {
    src: "/images/graph/dfs-phases/phase1.jpg",
    alt: "DFS - Undirected Graph - Step 2",
  },
  {
    src: "/images/graph/dfs-phases/phase2.jpg",
    alt: "DFS - Undirected Graph - Step 3",
  },
  {
    src: "/images/graph/dfs-phases/phase3.jpg",
    alt: "DFS - Undirected Graph - Step 4",
  },
  {
    src: "/images/graph/dfs-phases/phase4.jpg",
    alt: "DFS - Undirected Graph - Step 5",
  },
  {
    src: "/images/graph/dfs-phases/phase5.jpg",
    alt: "DFS - Undirected Graph - Step 6",
  },
  {
    src: "/images/graph/dfs-phases/phase6.jpg",
    alt: "DFS - Undirected Graph - Step 7",
  },
];

export default function ArticleDFS() {
  const images = imagesData.map((data, index) => (
    <VisualizationImageWithStep
      key={data.src}
      image={
        <Image
          className="w-auto"
          src={data.src}
          alt={data.alt}
          width={300}
          height={400}
        />
      }
      step={index + 1}
    />
  ));

  return (
    <div className="bg-base-200 max-w-5xl rounded-sm p-8">
      <h1 className="text-2xl font-semibold text-white">DFS</h1>
      <p className="my-4">
        W algorytmie DFS (przeszukiwanie w głąb) przeszukujemy graf, odwiedzając
        kolejne sąsiadujące wierzchołki. Gdy odwiedzamy nowy wierzchołek,
        najpierw sprawdzamy wszystkie miejsca, do których można z niego dotrzeć,
        zanim wrócimy do poprzedniego poziomu. W grafach mogą występować pętle,
        więc jeden wierzchołek mógłby być odwiedzany wielokrotnie. Żeby tego
        uniknąć, stosujemy tablicę visited, w której zaznaczamy już odwiedzone
        punkty.
      </p>
      <p className="my-4">W pseudokodzie algorytm DFS zapiszemy następująco:</p>
      <pre className="my-4">
        {`visited = {}
procedure DFS(node):
    visited.add(node)
    for each neighbour in neighbours(node):
        if neighbour not in visited:
            DFS(neighbour)
`}
      </pre>
      <p className="my-4">
        A na wizualizacji powyższy kod wykona się w następujący sposób
      </p>
      <div className="flex flex-row flex-wrap justify-center gap-2 select-none">
        {images}
      </div>

      <ArticleParagraph>
        Powyższy kod reprezentuje podejście rekurencyjne. Złożoność obliczeniowa
        wtedy jest następująca:
      </ArticleParagraph>

      <ArticleParagraph>
        <b>Złożoność czasowa: O(V + E)</b>, gdzie V to liczba wierzchołków, a E
        to liczba krawędzi w grafie.
      </ArticleParagraph>

      <ArticleParagraph>
        <b>Złożoność pamięciowa: O(2V) = O(V)</b>, ponieważ wymagana jest
        dodatkowa tablica odwiedzonych elementów o rozmiarze V oraz stos dla
        rekurencyjnych wywołań funkcji DFS. W najgorszym przypadku, jeśli graf
        jest linią prostą lub długą ścieżką, rekurencja DFS może sięgać tak
        głęboko, jak liczba wierzchołków.
      </ArticleParagraph>

      <ArticleParagraph>
        Aby zmienić podejście rekurencyjne na iteracyjne to musimy zastosować
        strukturę danych stos. Kod prezentuje się wtedy następująco:
      </ArticleParagraph>

      <pre className="my-4">
        {`
procedure DFS(initialNode):
    stack = {initialNode}
    visited = {initialNode}

    while stack is not empty:
        node = stack.pop()

        for each neighbour in neighbours(node):
            if neighbour not in visited:
                stack.add(neighbour)
                visited.add(neighbour)
`}
      </pre>
      <ArticleParagraph>
        <b>Złożoność czasowa: O(V + E)</b>, gdzie V to liczba wierzchołków, a E
        to liczba krawędzi w grafie.
      </ArticleParagraph>

      <ArticleParagraph>
        <b>Złożoność pamięciowa: O(2V) = O(V)</b>, ponieważ wymagana jest
        dodatkowa tablica odwiedzonych elementów o rozmiarze V oraz stos, który
        w sumie będzie przechowywać V wierzchołków.
      </ArticleParagraph>

      <Quiz questions={quizDFS} />
    </div>
  );
}
