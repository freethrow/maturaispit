import { motion } from 'framer-motion'
import Footer from './Footer'
import DarkModeToggle from './DarkModeToggle'

function WrongAnswersScreen({ wrongAnswers, onBack, onClearWrongAnswers, darkMode, toggleDarkMode }) {
  // Convert to array and sort by count (highest first)
  const sortedWrongAnswers = Object.entries(wrongAnswers)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className={`min-h-screen p-8 pb-16 transition-colors ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Погрешно одговорени
            </h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Назад
            </motion.button>
          </div>

          {sortedWrongAnswers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-8 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
            >
              <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Нема погрешно одговорених питања!
              </p>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Одлично! Наставите са вежбањем.
              </p>
            </motion.div>
          ) : (
            <>
              <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Укупно {sortedWrongAnswers.length} питања са грешкама. Сортирано по броју грешака.
              </p>

              <div className="space-y-4">
                {sortedWrongAnswers.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        item.count >= 4
                          ? 'bg-red-500 text-white'
                          : item.count >= 2
                          ? 'bg-orange-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}>
                        {item.count}x погрешно
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Питање #{item.question.number}
                      </span>
                    </div>

                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.question.question}
                    </h3>

                    {item.question.has_picture && (
                      <div className="mb-4">
                        <img
                          src={`/pics/${String(item.question.number).padStart(3, '0')}.png`}
                          alt="Question image"
                          className="max-w-full h-auto rounded-lg"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      {Object.entries(item.question.answers).map(([key, value]) => {
                        const isCorrect = item.question.correct_answers.map(String).includes(key)
                        return (
                          <div
                            key={key}
                            className={`p-3 rounded-lg ${
                              isCorrect
                                ? darkMode
                                  ? 'bg-green-900/50 border border-green-600'
                                  : 'bg-green-100 border border-green-400'
                                : darkMode
                                ? 'bg-gray-700'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            <span className={`${
                              isCorrect
                                ? darkMode
                                  ? 'text-green-300'
                                  : 'text-green-700'
                                : darkMode
                                ? 'text-gray-300'
                                : 'text-gray-700'
                            }`}>
                              {isCorrect && '✓ '}{value}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (window.confirm('Да ли сте сигурни да желите да обришете историју погрешних одговора?')) {
                    onClearWrongAnswers()
                  }
                }}
                className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Обриши историју погрешних одговора
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

export default WrongAnswersScreen
