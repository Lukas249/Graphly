interface Question {
  question: string
  choices: string[]
  type: string
  correctAnswer: number,
  explanation: string
}

interface QuizData {
  topic: string
  level: string
  totalQuestions: number
  perQuestionScore: number
  questions: Question[]
}

export const quiz: QuizData = {
  topic: 'Javascript',
  level: 'Beginner',
  totalQuestions: 4,
  perQuestionScore: 5,
  questions: [
    {
      question: 'Which function is used to serialize an object into a JSON string in Javascript?',
      choices: ['stringify()', 'parse()', 'convert()', 'None of the above'],
      type: 'MCQs',
      correctAnswer: 1,
      explanation: "Explanation1"
    },
    {
      question: 'Which of the following keywords is used to define a variable in Javascript?',
      choices: ['var', 'let', 'var and let', 'None of the above'],
      type: 'MCQs',
      correctAnswer: 3,
      explanation: "Explanation2"
    },
    {
      question:
        'Which of the following methods can be used to display data in some form using Javascript?',
      choices: ['document.write()', 'console.log()', 'window.alert', 'All of the above'],
      type: 'MCQs',
      correctAnswer: 4,
      explanation: "Explanation3"
    },
    {
      question: 'How can a datatype be declared to be a constant type?',
      choices: ['const', 'var', 'let', 'constant'],
      type: 'MCQs',
      correctAnswer: 1,
      explanation: "Explanation4"
    },
  ],
}