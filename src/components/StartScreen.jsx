import { motion } from 'framer-motion'
import Statistics from './Statistics'
import Footer from './Footer'
import DarkModeToggle from './DarkModeToggle'

function StartScreen({ questionCount, setQuestionCount, onStart, stats, onResetStats, darkMode, toggleDarkMode }) {
  return (
    <div className={`min-h-screen flex items-center justify-center p-8 pb-16 transition-colors ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-8 rounded-lg shadow-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h1 className={`text-4xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>Матурски Квиз</h1>
          <p className={`mb-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Изаберите број питања за квиз</p>

          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Број питања: {questionCount}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${darkMode ? 'bg-blue-900' : 'bg-blue-200'}`}
            />
            <div className={`flex justify-between text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Почни квиз
          </motion.button>
        </motion.div>

        <Statistics stats={stats} onResetStats={onResetStats} darkMode={darkMode} />
      </motion.div>
      <Footer />
    </div>
  )
}

export default StartScreen
