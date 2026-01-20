import { motion, AnimatePresence } from 'framer-motion'
import Footer from './Footer'
import DarkModeToggle from './DarkModeToggle'

function QuizScreen({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  score,
  totalPoints,
  shuffledAnswers,
  selectedAnswers,
  showResult,
  onAnswerToggle,
  onSubmit,
  onExit,
  darkMode,
  toggleDarkMode
}) {
  const expectedAnswersCount = currentQuestion.correct_answers.length
  const correctAnswers = currentQuestion.correct_answers.map(String)

  const handleExit = () => {
    if (window.confirm('Да ли сте сигурни да желите да напустите квиз? Прогрес неће бити сачуван.')) {
      onExit()
    }
  }

  return (
    <div className={`min-h-screen p-8 pb-16 transition-colors ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Матурски Квиз</h1>
          <button
            onClick={handleExit}
            className={`px-4 py-2 text-red-600 hover:text-red-700 rounded-lg transition-colors ${darkMode ? 'hover:bg-red-900' : 'hover:bg-red-50'}`}
          >
            Изађи из квиза
          </button>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Питање {currentQuestionIndex + 1} од {totalQuestions} <span className={`ml-2 font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>(#{currentQuestion.number})</span>
          </div>
          <div className="text-xl font-bold text-blue-600">
            Поени: {score} / {totalPoints}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
          >
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentQuestion.question}</h2>

            {currentQuestion.has_picture && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 flex justify-center"
              >
                <img
                  src={`/pics/${String(currentQuestion.number).padStart(3, '0')}.png`}
                  alt={`Питање ${currentQuestion.number}`}
                  className="max-w-full h-auto rounded-lg border-2 border-gray-300"
                />
              </motion.div>
            )}

            <div className={`mb-4 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Изаберите {expectedAnswersCount} {expectedAnswersCount === 1 ? 'одговор' : 'одговора'}
            </div>

            <div className="space-y-3 mb-6">
              {shuffledAnswers.map((answer, index) => {
                const isSelected = selectedAnswers.includes(answer.id)
                const isCorrect = correctAnswers.includes(answer.id)

                let buttonClass = ''
                if (showResult) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-500 border-green-600 text-white'
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-red-500 border-red-600 text-white'
                  } else {
                    buttonClass = darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-200'
                  }
                } else {
                  buttonClass = isSelected
                    ? 'bg-blue-500 border-blue-600 text-white'
                    : darkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-200 hover:border-blue-500 hover:bg-gray-600'
                      : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }

                return (
                  <motion.button
                    key={answer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => !showResult && onAnswerToggle(answer.id)}
                    disabled={showResult}
                    className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${buttonClass} ${showResult ? 'cursor-not-allowed' : ''}`}
                  >
                    {answer.text}
                  </motion.button>
                )
              })}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onSubmit}
              disabled={selectedAnswers.length === 0 || showResult}
              className="w-full p-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Потврди одговор
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  )
}

export default QuizScreen
