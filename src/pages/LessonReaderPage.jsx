// pages/LessonReaderPage.jsx
import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Highlighter, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { H1, H2, Body } from '../components/ui/Typography';
import Button from '../components/ui/Button';

export default function LessonReaderPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dummy lesson data - replace with actual data fetch
  const lesson = {
    title: "Lesson 1 – Letter Sounds",
    content: `This lesson focuses on the fundamental sounds of letters. We will explore how each letter makes a unique sound and how these sounds combine to form words. The text is specifically formatted with increased spacing between letters and lines, and a high-contrast background to improve readability and reduce visual stress. This will help you focus on the content and learn more effectively.`,
    quiz: {
      question: "What sound does the letter 'A' make in the word 'apple'?",
      options: [
        "The 'ay' sound as in 'ape'",
        "The 'ah' sound as in 'father'",
        "The short 'a' sound as in 'cat'",
        "The 'o' sound as in 'all'"
      ],
      correctAnswer: 2
    }
  };

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    // Implement TTS here
  };

  const handleHighlight = () => {
    setIsHighlighting(!isHighlighting);
    // Implement text highlighting here
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      
      {/* Top Control Bar */}
      <div className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          >
            <ArrowLeft className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
          </button>

          {/* Reading Controls */}
          <div className="flex items-center gap-2">
            
            {/* Font Size */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="px-3 py-1 hover:bg-white dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="px-3 py-1 hover:bg-white dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
              >
                A+
              </button>
            </div>

            {/* Font Weight Toggle */}
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <span className="font-bold text-lg">A</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-yellow-400" />
              ) : (
                <Moon className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Lesson Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-12 shadow-sm mb-8`}
        >
          
          {/* Lesson Title */}
          <H1 className={`mb-8 ${isDarkMode ? 'text-white' : ''}`}>
            {lesson.title}
          </H1>

          {/* Lesson Text */}
          <Body
            className={`mb-8 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.8,
              letterSpacing: '0.03em',
            }}
          >
            {lesson.content}
          </Body>

          {/* Audio Controls */}
          <div className="flex gap-4">
            <Button
              variant="accent"
              size="md"
              onClick={handlePlayAudio}
              icon={<Volume2 className="w-5 h-5" />}
            >
              {isPlaying ? 'Pause Audio' : 'Play Audio'}
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleHighlight}
              icon={<Highlighter className="w-5 h-5" />}
            >
              {isHighlighting ? 'Stop Highlighting' : 'Highlight Text'}
            </Button>
          </div>
        </motion.div>

        {/* Quiz Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-12 shadow-sm`}
        >
          
          <H2 className={`mb-6 ${isDarkMode ? 'text-white' : ''}`}>
            Check Your Understanding
          </H2>

          <Body className={`mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {lesson.quiz.question}
          </Body>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.quiz.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-6 rounded-2xl text-left transition-all
                  ${isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }
                  border-2 border-transparent hover:border-primary-500
                `}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}