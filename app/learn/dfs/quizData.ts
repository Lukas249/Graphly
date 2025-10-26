import { Question } from "@/app/components/quiz/quiz-card";

export const quizDFS: Question[] = [
  {
    question: "Co oznacza skrót DFS w teorii grafów?",
    answers: [
      "Depth First Search",
      "Direct Flow System",
      "Data Flow Search",
      "Depth Flow Sequence",
    ],
    correctAnswer: 1,
    explanation:
      "DFS oznacza Depth First Search - algorytm przeszukiwania grafu w głąb.",
  },
  {
    question:
      "Jaka struktura danych jest używana do implementacji DFS w sposób iteracyjny?",
    answers: [
      "Kolejka (Queue)",
      "Stos (Stack)",
      "Kopiec (Heap)",
      "Kolejka priorytetowa (Priority Queue)",
    ],
    correctAnswer: 2,
    explanation:
      "DFS korzysta ze stosu w implementacji iteracyjnej, aby śledzić kolejne wierzchołki do odwiedzenia.",
  },
  {
    question:
      "Jaka jest złożoność czasowa DFS dla grafu z V wierzchołkami i E krawędziami?",
    answers: ["O(V)", "O(E)", "O(V + E)", "O(V * E)"],
    correctAnswer: 3,
    explanation:
      "DFS odwiedza każdy wierzchołek i każdą krawędź dokładnie raz, co daje złożoność O(V + E).",
  },
  {
    question:
      "Dlaczego w DFS potrzebna jest tablica odwiedzonych wierzchołków?",
    answers: [
      "Aby przechowywać wartości wierzchołków",
      "Aby uniknąć wielokrotnego odwiedzania tego samego wierzchołka",
      "Aby przyspieszyć działanie algorytmu",
      "Aby przechowywać najkrótszą ścieżkę",
    ],
    correctAnswer: 2,
    explanation:
      "Zbiór lub tablica visited zapobiega odwiedzaniu tych samych wierzchołków wielokrotnie, co chroni przed nieskończoną pętlą w grafach z cyklami.",
  },
  {
    question:
      "Któremu sposobowi przechodzenia drzewa odpowiada DFS - jeśli najpierw dodaje wierzchołek do odwiedzonych, a dopiero potem przechodzi do pozostałych wierzchołków.",
    answers: ["Post-order", "Pre-order", "In-order", "Level-order"],
    correctAnswer: 2,
    explanation:
      "Podobny jest do przechodzenia grafu w trybie pre-order, gdzie najpierw odwiedzamy początkowy wierzchołek i schodzimy jak najgłębiej, zanim przejdziemy do kolejnych gałęzi.",
  },
];
