function Statistics({ stats, onResetStats, darkMode }) {
  const avgPercentage = stats.percentages.length > 0
    ? Math.round(stats.percentages.reduce((a, b) => a + b, 0) / stats.percentages.length)
    : 0
  const avgCorrectPerQuestion = stats.totalQuestions > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
    : 0

  const handleReset = () => {
    if (window.confirm('Да ли сте сигурни да желите да ресетујете статистику?')) {
      onResetStats()
    }
  }

  if (stats.totalQuizzes === 0) {
    return null
  }

  return (
    <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold text-center flex-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Статистика</h2>
        <button
          onClick={handleReset}
          className="text-sm text-red-600 hover:text-red-700 hover:underline"
        >
          Ресетуј
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <div className="text-3xl font-bold text-blue-600">{stats.totalQuizzes}</div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Укупно квизова</div>
        </div>
        <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <div className="text-3xl font-bold text-green-600">{stats.totalQuestions}</div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Укупно питања</div>
        </div>
        <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <div className="text-3xl font-bold text-purple-600">{stats.highScore}%</div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Најбољи резултат</div>
        </div>
        <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <div className="text-3xl font-bold text-orange-600">{avgPercentage}%</div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Просечан резултат</div>
        </div>
        <div className={`p-4 rounded-lg text-center col-span-2 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <div className="text-3xl font-bold text-teal-600">{avgCorrectPerQuestion}%</div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Тачност по питању</div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
