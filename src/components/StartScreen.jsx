import { motion } from 'framer-motion'
import Statistics from './Statistics'
import Footer from './Footer'
import DarkModeToggle from './DarkModeToggle'

function StartScreen({ questionCount, setQuestionCount, selectedSection, setSelectedSection, sections, onStart, stats, onResetStats, darkMode, toggleDarkMode }) {
  // Calculate the position percentage for the slider thumb
  const getSliderPosition = () => {
    const min = 5;
    const max = 50;
    return ((questionCount - min) / (max - min)) * 100;
  };

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
          <p className={`mb-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Изаберите параметре квиза</p>

          {/* Section Selection */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Одељак
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className={`w-full p-3 rounded-lg border-2 transition-colors ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
            >
              <option value="all">Сви одељци ({sections.reduce((sum, s) => sum + s.questions.length, 0)} питања)</option>
              <option value="hard">САМО ТЕШКА ПИТАЊА ({sections.reduce((sum, s) => sum + s.questions.filter(q => q.hard === true).length, 0)} питања)</option>
              {sections.map(section => (
                <option key={section.section_number} value={section.section_number}>
                  {section.section_name} ({section.questions.length} питања)
                </option>
              ))}
            </select>
          </div>

          {/* Question Count Slider */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Број питања:
            </label>

            {/* Slider container with relative positioning */}
            <div className="relative pt-10 pb-2">
              {/* Value indicator positioned above the thumb with arrow */}
              <div
                className="absolute -top-1 transform -translate-x-1/2 transition-all duration-150 ease-out pointer-events-none"
                style={{ left: `${getSliderPosition()}%` }}
              >
                <div className="relative">
                  <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    }`}>
                    {questionCount}
                  </span>
                  {/* Arrow pointing down */}
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 ${darkMode ? 'arrow-down-dark' : 'arrow-down-light'
                      }`}
                    style={{
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: darkMode ? '6px solid #2563eb' : '6px solid #3b82f6',
                      bottom: '-5px'
                    }}
                  />
                </div>
              </div>

              {/* Slider input */}
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${darkMode ? 'bg-blue-900' : 'bg-blue-200'}`}
                style={{
                  background: darkMode
                    ? `linear-gradient(to right, #1e40af 0%, #1e40af ${getSliderPosition()}%, #1e3a8a ${getSliderPosition()}%, #1e3a8a 100%)`
                    : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${getSliderPosition()}%, #bfdbfe ${getSliderPosition()}%, #bfdbfe 100%)`
                }}
              />
            </div>

            {/* Scale markers */}
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