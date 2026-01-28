import { useState, useEffect, useRef } from 'react'
import data from './hard.json'
import StartScreen from './components/StartScreen'
import QuizScreen from './components/QuizScreen'
import ResultsScreen from './components/ResultsScreen'
import WrongAnswersScreen from './components/WrongAnswersScreen'

function App() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [questionCount, setQuestionCount] = useState(5)
  const [selectedSection, setSelectedSection] = useState('hard')
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('quizStats')
    return saved ? JSON.parse(saved) : {
      totalQuizzes: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalPoints: 0,
      maxPoints: 0,
      highScore: 0,
      percentages: []
    }
  })
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [wrongAnswers, setWrongAnswers] = useState(() => {
    const saved = localStorage.getItem('wrongAnswers')
    return saved ? JSON.parse(saved) : {}
  })
  const [showWrongAnswers, setShowWrongAnswers] = useState(false)
  const statsUpdatedRef = useRef(false)

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode))
  }

  const startQuiz = () => {
    // Get questions based on selected section
    let questionsPool = []
    if (selectedSection === 'hard') {
      // Filter only hard questions from all sections
      questionsPool = data.sections.flatMap(section =>
        section.questions.filter(q => q.hard === true)
      )
    } else if (selectedSection === 'extreme') {
      // Filter only extreme questions from all sections
      questionsPool = data.sections.flatMap(section =>
        section.questions.filter(q => q.extreme === true)
      )
    } else if (selectedSection === 'all') {
      questionsPool = data.sections.flatMap(section => section.questions)
    } else {
      const section = data.sections.find(s => s.section_number === parseInt(selectedSection))
      questionsPool = section ? section.questions : []
    }

    // Select random questions based on user selection
    const shuffled = [...questionsPool].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(questionCount, questionsPool.length))

    setQuizQuestions(selected)

    // Calculate total possible points
    const total = selected.reduce((sum, q) => sum + q.points, 0)
    setTotalPoints(total)

    // Reset stats update flag
    statsUpdatedRef.current = false

    setQuizStarted(true)
  }

  const resetStats = () => {
    const emptyStats = {
      totalQuizzes: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalPoints: 0,
      maxPoints: 0,
      highScore: 0,
      percentages: []
    }
    setStats(emptyStats)
    localStorage.setItem('quizStats', JSON.stringify(emptyStats))
  }

  const clearWrongAnswers = () => {
    setWrongAnswers({})
    localStorage.setItem('wrongAnswers', JSON.stringify({}))
  }

  const exitQuiz = () => {
    setQuizStarted(false)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setScore(0)
    setUserAnswers([])
    setQuizQuestions([])
    setShuffledAnswers([])
    setSelectedAnswers([])
    setShowResult(false)
  }

  // Shuffle answers when question changes
  useEffect(() => {
    if (quizQuestions.length > 0) {
      const currentQuestion = quizQuestions[currentQuestionIndex]
      const answersArray = Object.entries(currentQuestion.answers).map(([key, value]) => ({
        id: key,
        text: value
      }))

      // Shuffle answers
      const shuffled = [...answersArray].sort(() => Math.random() - 0.5)
      setShuffledAnswers(shuffled)
      setSelectedAnswers([])
      setShowResult(false)
    }
  }, [quizQuestions, currentQuestionIndex])

  // Update stats when quiz completes
  useEffect(() => {
    if (quizCompleted && !statsUpdatedRef.current) {
      statsUpdatedRef.current = true
      const correctCount = userAnswers.filter(answer => answer.isCorrect).length
      const percentage = Math.round((score / totalPoints) * 100)

      const newStats = {
        totalQuizzes: stats.totalQuizzes + 1,
        totalQuestions: stats.totalQuestions + quizQuestions.length,
        totalCorrect: stats.totalCorrect + correctCount,
        totalPoints: stats.totalPoints + score,
        maxPoints: stats.maxPoints + totalPoints,
        highScore: Math.max(stats.highScore, percentage),
        percentages: [...stats.percentages, percentage]
      }
      setStats(newStats)
      localStorage.setItem('quizStats', JSON.stringify(newStats))
    }
  }, [quizCompleted, userAnswers, score, totalPoints, stats, quizQuestions.length])

  const handleAnswerToggle = (answerId) => {
    setSelectedAnswers(prev => {
      if (prev.includes(answerId)) {
        return prev.filter(id => id !== answerId)
      } else {
        return [...prev, answerId]
      }
    })
  }

  const handleSubmit = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex]
    const correctAnswers = currentQuestion.correct_answers.map(String)
    const sortedSelected = [...selectedAnswers].sort()
    const sortedCorrect = [...correctAnswers].sort()

    // Check if answers match exactly
    const isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect)

    if (isCorrect) {
      setScore(score + currentQuestion.points)
    } else {
      // Track wrong answer with counter
      const questionId = currentQuestion.number
      setWrongAnswers(prev => {
        const updated = {
          ...prev,
          [questionId]: {
            question: currentQuestion,
            count: (prev[questionId]?.count || 0) + 1,
            lastAnswered: new Date().toISOString()
          }
        }
        localStorage.setItem('wrongAnswers', JSON.stringify(updated))
        return updated
      })
    }

    // Store user's answer for this question
    setUserAnswers(prev => [...prev, {
      question: currentQuestion,
      selectedAnswers: selectedAnswers,
      isCorrect: isCorrect
    }])

    // Show result
    setShowResult(true)

    // Move to next question after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setQuizCompleted(true)
      }
    }, 2000)
  }

  // Show wrong answers screen
  if (showWrongAnswers) {
    return (
      <WrongAnswersScreen
        wrongAnswers={wrongAnswers}
        onBack={() => setShowWrongAnswers(false)}
        onClearWrongAnswers={clearWrongAnswers}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    )
  }

  // Show start screen if quiz hasn't started
  if (!quizStarted) {
    return (
      <StartScreen
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        sections={data.sections}
        onStart={startQuiz}
        stats={stats}
        onResetStats={resetStats}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        wrongAnswersCount={Object.keys(wrongAnswers).length}
        onShowWrongAnswers={() => setShowWrongAnswers(true)}
      />
    )
  }

  // Show results screen if quiz is completed
  if (quizCompleted) {
    return (
      <ResultsScreen
        userAnswers={userAnswers}
        score={score}
        totalPoints={totalPoints}
        quizQuestions={quizQuestions}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onRetakeQuiz={exitQuiz}
      />
    )
  }

  const currentQuestion = quizQuestions[currentQuestionIndex]

  return (
    <QuizScreen
      currentQuestion={currentQuestion}
      currentQuestionIndex={currentQuestionIndex}
      totalQuestions={quizQuestions.length}
      score={score}
      totalPoints={totalPoints}
      shuffledAnswers={shuffledAnswers}
      selectedAnswers={selectedAnswers}
      showResult={showResult}
      onAnswerToggle={handleAnswerToggle}
      onSubmit={handleSubmit}
      onExit={exitQuiz}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
    />
  )
}

export default App
