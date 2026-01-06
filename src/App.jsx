import { useState, useEffect } from 'react'
import data from './reformatted.json'

function App() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [questionCount, setQuestionCount] = useState(5)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])

  const startQuiz = () => {
    // Flatten all questions from all sections
    const allQuestions = data.sections.flatMap(section => section.questions)

    // Select random questions based on user selection
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, questionCount)

    setQuizQuestions(selected)

    // Calculate total possible points
    const total = selected.reduce((sum, q) => sum + q.points, 0)
    setTotalPoints(total)

    setQuizStarted(true)
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

  // Show start screen if quiz hasn't started
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-gray-50 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-center">Матурски Квиз</h1>
          <p className="text-gray-600 mb-8 text-center">Изаберите број питања за квиз</p>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-3 text-gray-700">
              Број питања: {questionCount}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40</span>
              <span>45</span>
              <span>50</span>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Почни квиз
          </button>
        </div>
      </div>
    )
  }

  // Show results screen if quiz is completed
  if (quizCompleted) {
    const incorrectAnswers = userAnswers.filter(answer => !answer.isCorrect)
    const correctCount = userAnswers.filter(answer => answer.isCorrect).length
    const incorrectCount = incorrectAnswers.length
    const percentage = Math.round((score / totalPoints) * 100)

    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Резултати квиза</h1>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{score}/{totalPoints}</div>
              <div className="text-gray-600">Поени</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{correctCount}</div>
              <div className="text-gray-600">Тачно</div>
            </div>
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-gray-600">Нетачно</div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Учинак</h2>
            <div className="flex items-center justify-center">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="40"
                  strokeDasharray={`${(incorrectCount / quizQuestions.length) * 502.65} 502.65`}
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="40"
                  strokeDasharray={`${(correctCount / quizQuestions.length) * 502.65} 502.65`}
                  strokeDashoffset={`-${(incorrectCount / quizQuestions.length) * 502.65}`}
                  transform="rotate(-90 100 100)"
                />
                <text x="100" y="100" textAnchor="middle" dy="0.3em" fontSize="32" fontWeight="bold">
                  {percentage}%
                </text>
              </svg>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Тачно ({correctCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Нетачно ({incorrectCount})</span>
              </div>
            </div>
          </div>

          {/* Incorrect Answers */}
          {incorrectAnswers.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Нетачни одговори</h2>
              <div className="space-y-4">
                {incorrectAnswers.map((answer, index) => {
                  const correctAnswerIds = answer.question.correct_answers.map(String)
                  const correctAnswerTexts = correctAnswerIds.map(id => answer.question.answers[id])
                  const selectedAnswerTexts = answer.selectedAnswers.map(id => answer.question.answers[id])

                  return (
                    <div key={index} className="bg-white p-4 rounded-lg border-2 border-red-200">
                      <h3 className="font-semibold mb-2">{answer.question.question}</h3>

                      {answer.question.has_picture && (
                        <div className="mb-3 flex justify-center">
                          <img
                            src={`/pics/${String(answer.question.number).padStart(3, '0')}.png`}
                            alt={`Question ${answer.question.number}`}
                            className="max-w-md h-auto rounded-lg border-2 border-gray-300"
                          />
                        </div>
                      )}

                      <div className="mb-2">
                        <span className="text-red-600 font-medium">Ваш одговор: </span>
                        <span>{selectedAnswerTexts.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-green-600 font-medium">Тачан одговор: </span>
                        <span>{correctAnswerTexts.join(', ')}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {incorrectAnswers.length === 0 && (
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <h2 className="text-2xl font-bold text-green-600">Савршен резултат!</h2>
              <p className="text-gray-600 mt-2">Тачно сте одговорили на сва питања!</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const expectedAnswersCount = currentQuestion.correct_answers.length
  const correctAnswers = currentQuestion.correct_answers.map(String)

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Матурски Квиз</h1>

        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-600">
            Питање {currentQuestionIndex + 1} од {quizQuestions.length}
          </div>
          <div className="text-xl font-bold text-blue-600">
            Поени: {score} / {totalPoints}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>

          {currentQuestion.has_picture && (
            <div className="mb-4 flex justify-center">
              <img
                src={`/pics/${String(currentQuestion.number).padStart(3, '0')}.png`}
                alt={`Питање ${currentQuestion.number}`}
                className="max-w-full h-auto rounded-lg border-2 border-gray-300"
              />
            </div>
          )}

          <div className="mb-4 text-sm text-gray-600">
            Изаберите {expectedAnswersCount} {expectedAnswersCount === 1 ? 'одговор' : 'одговора'}
          </div>

          <div className="space-y-3 mb-6">
            {shuffledAnswers.map((answer) => {
              const isSelected = selectedAnswers.includes(answer.id)
              const isCorrect = correctAnswers.includes(answer.id)

              let buttonClass = ''
              if (showResult) {
                if (isCorrect) {
                  buttonClass = 'bg-green-500 border-green-600 text-white'
                } else if (isSelected && !isCorrect) {
                  buttonClass = 'bg-red-500 border-red-600 text-white'
                } else {
                  buttonClass = 'bg-white border-gray-200'
                }
              } else {
                buttonClass = isSelected
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'
              }

              return (
                <button
                  key={answer.id}
                  onClick={() => !showResult && handleAnswerToggle(answer.id)}
                  disabled={showResult}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${buttonClass} ${showResult ? 'cursor-not-allowed' : ''}`}
                >
                  {answer.text}
                </button>
              )
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedAnswers.length === 0 || showResult}
            className="w-full p-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Потврди одговор
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
