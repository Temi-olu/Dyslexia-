import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Highlighter, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { getCourseById, getLessonById, getNextLesson, getPreviousLesson } from '../Data/coursesData';

export default function LessonReaderPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  // Get course and lesson data
  const course = getCourseById(courseId);
  const lesson = getLessonById(courseId, lessonId);
  const nextLesson = getNextLesson(courseId, lessonId);
  const previousLesson = getPreviousLesson(courseId, lessonId);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Refs
  const synth = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  // Handle lesson not found
  useEffect(() => {
    if (!course || !lesson) {
      toast.error('Lesson not found');
      navigate('/courses');
    }
  }, [course, lesson, navigate]);

  if (!course || !lesson) {
    return null;
  }

  // Text-to-Speech
  const handlePlayAudio = () => {
    if (isPlaying) {
      // Stop
      synth.current.cancel();
      setIsPlaying(false);
    } else {
      // Play
      utteranceRef.current = new SpeechSynthesisUtterance(lesson.content);
      utteranceRef.current.rate = 1;
      utteranceRef.current.pitch = 1;
      utteranceRef.current.volume = 1;
      utteranceRef.current.onend = () => setIsPlaying(false);
      
      synth.current.speak(utteranceRef.current);
      setIsPlaying(true);
      toast.success('Audio started');
    }
  };

  // Handle quiz answer
  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    const correct = index === lesson.quiz.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      toast.success('Correct! Well done! 🎉');
    } else {
      toast.error('Not quite right. Try again!');
    }
  };

  // Navigation
  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
      setSelectedAnswer(null);
      setShowResult(false);
      toast.success('Moving to next lesson');
    } else {
      toast.success('Course completed! 🎉');
      navigate('/courses');
    }
  };

  const handlePreviousLesson = () => {
    if (previousLesson) {
      navigate(`/course/${courseId}/lesson/${previousLesson.id}`);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors`}>
      
      {/* Top Control Bar */}
      <div className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Back Button */}
            <button
              onClick={() => navigate('/courses')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              <span className={`hidden sm:inline font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                Back to Courses
              </span>
            </button>

            {/* Course Title */}
            <div className="hidden md:block text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {course.title}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Lesson {lesson.order} of {course.totalLessons}
              </p>
            </div>

            {/* Reading Controls */}
            <div className="flex items-center gap-2">
              
              {/* Font Size */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className="px-3 py-1 hover:bg-white dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
                  aria-label="Decrease font size"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                  className="px-3 py-1 hover:bg-white dark:hover:bg-gray-600 rounded text-sm font-medium transition-colors"
                  aria-label="Increase font size"
                >
                  A+
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Lesson Progress
            </span>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {lesson.order} / {course.totalLessons}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(lesson.order / course.totalLessons) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-primary-600 rounded-full"
            />
          </div>
        </div>

        {/* Lesson Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lessonId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <card 
              variant="default" 
              padding="spacious"
              className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}
            >
              
              {/* Lesson Title */}
              <h1 className={`mb-8 ${isDarkMode ? 'text-white' : ''}`}>
                {lesson.title}
              </h1>

              {/* Lesson Text */}
              <body
                className={`mb-8 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.8,
                  letterSpacing: '0.03em',
                }}
              >
                {lesson.content}
              </body>

              {/* Audio Controls */}
              <div className="flex gap-4">
                <button
                  variant="accent"
                  size="md"
                  onClick={handlePlayAudio}
                  icon={isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                >
                  {isPlaying ? 'Stop Audio' : 'Play Audio'}
                </button>

                <button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsHighlighting(!isHighlighting)}
                  icon={<Highlighter className="w-5 h-5" />}
                >
                  {isHighlighting ? 'Stop Highlighting' : 'Highlight Text'}
                </button>
              </div>
            </card>
          </motion.div>
        </AnimatePresence>

        {/* Quiz Section */}
        {lesson.quiz && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <card 
              variant="default" 
              padding="spacious"
              className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}
            >
              
              <h2 className={`mb-6 ${isDarkMode ? 'text-white' : ''}`}>
                Check Your Understanding
              </h2>

              <body className={`mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {lesson.quiz.question}
              </body>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {lesson.quiz.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`
                      p-6 rounded-2xl text-left transition-all
                      ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-800'}
                      ${!showResult && (isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100')}
                      ${selectedAnswer === index && !showResult ? 'ring-2 ring-primary-500' : ''}
                      ${showResult && index === lesson.quiz.correctAnswer ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900' : ''}
                      ${showResult && selectedAnswer === index && !isCorrect ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900' : ''}
                      ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                        ${showResult && index === lesson.quiz.correctAnswer ? 'bg-green-500 text-white' : ''}
                        ${showResult && selectedAnswer === index && !isCorrect ? 'bg-red-500 text-white' : ''}
                        ${!showResult ? 'bg-gray-200 dark:bg-gray-600' : ''}
                      `}>
                        {showResult && index === lesson.quiz.correctAnswer && '✓'}
                        {showResult && selectedAnswer === index && !isCorrect && '✗'}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Explanation (shown after answer) */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-4 rounded-xl ${
                    isCorrect 
                      ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700' 
                      : 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700'
                  }`}
                >
                  <p className={`text-sm font-semibold mb-2 ${
                    isCorrect ? 'text-green-800 dark:text-green-200' : 'text-blue-800 dark:text-blue-200'
                  }`}>
                    {isCorrect ? '✓ Correct!' : 'ℹ️ Explanation:'}
                  </p>
                  <p className={`text-sm ${
                    isCorrect ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'
                  }`}>
                    {lesson.quiz.explanation}
                  </p>
                </motion.div>
              )}
            </card>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            variant="secondary"
            size="md"
            onClick={handlePreviousLesson}
            disabled={!previousLesson}
            icon={<ChevronLeft className="w-5 h-5" />}
          >
            Previous Lesson
          </button>

          <button
            variant="primary"
            size="md"
            onClick={handleNextLesson}
            icon={<ChevronRight className="w-5 h-5" />}
            iconPosition="right"
          >
            {nextLesson ? 'Next Lesson' : 'Complete Course'}
          </button>
        </div>
      </div>
    </div>
  );
}