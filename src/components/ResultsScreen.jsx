import { motion } from 'framer-motion'
import Footer from './Footer'
import DarkModeToggle from './DarkModeToggle'

function ResultsScreen({ userAnswers, score, totalPoints, quizQuestions, darkMode, toggleDarkMode, onRetakeQuiz }) {
  const incorrectAnswers = userAnswers.filter(answer => !answer.isCorrect)
  const correctCount = userAnswers.filter(answer => answer.isCorrect).length
  const incorrectCount = incorrectAnswers.length
  const percentage = Math.round((score / totalPoints) * 100)

  return (
    <div className={`min-h-screen p-8 pb-16 transition-colors ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}
        >
          Резултати квиза
        </motion.h1>

        {/* Summary Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
            <div className="text-3xl font-bold text-blue-600">{score}/{totalPoints}</div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Поени</div>
          </div>
          <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-green-900' : 'bg-green-50'}`}>
            <div className="text-3xl font-bold text-green-600">{correctCount}</div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Тачно</div>
          </div>
          <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-red-900' : 'bg-red-50'}`}>
            <div className="text-3xl font-bold text-red-600">{incorrectCount}</div>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Нетачно</div>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-lg mb-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl font-semibold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>Учинак</h2>
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
              <text x="100" y="100" textAnchor="middle" dy="0.3em" fontSize="32" fontWeight="bold" fill={darkMode ? '#fff' : '#000'}>
                {percentage}%
              </text>
            </svg>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Тачно ({correctCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Нетачно ({incorrectCount})</span>
            </div>
          </div>
        </motion.div>

        {/* Incorrect Answers */}
        {incorrectAnswers.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
          >
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Нетачни одговори</h2>
            <div className="space-y-4">
              {incorrectAnswers.map((answer, index) => {
                const correctAnswerIds = answer.question.correct_answers.map(String)
                const correctAnswerTexts = correctAnswerIds.map(id => answer.question.answers[id])
                const selectedAnswerTexts = answer.selectedAnswers.map(id => answer.question.answers[id])

                return (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`p-4 rounded-lg border-2 ${darkMode ? 'bg-gray-700 border-red-800' : 'bg-white border-red-200'}`}
                  >
                    <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{answer.question.question}</h3>

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
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>{selectedAnswerTexts.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Тачан одговор: </span>
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-900'}>{correctAnswerTexts.join(', ')}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {incorrectAnswers.length === 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`p-6 rounded-lg text-center ${darkMode ? 'bg-green-900' : 'bg-green-50'}`}
          >
            <h2 className="text-2xl font-bold text-green-600">Савршен резултат!</h2>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Тачно сте одговорили на сва питања!</p>
          </motion.div>
        )}

        {/* Retake Quiz Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetakeQuiz}
            className="px-12 py-4 bg-blue-600 text-white rounded-lg font-bold text-xl hover:bg-blue-700 transition-colors shadow-lg"
          >
            Понови квиз
          </motion.button>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  )
}

export default ResultsScreen
