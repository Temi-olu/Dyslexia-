import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Highlighter, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [highlightColor, setHighlightColor] = useState('#fef08a'); // Yellow
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Refs
  const synth = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const contentRef = useRef(null);

  // Handle lesson not found
  useEffect(() => {
    if (!course || !lesson) {
      alert('Lesson not found');
      navigate('/courses');
    }
  }, [course, lesson, navigate]);

  // Enable text selection highlighting
  useEffect(() => {
    if (isHighlighting) {
      document.addEventListener('mouseup', handleTextSelection);
    } else {
      document.removeEventListener('mouseup', handleTextSelection);
    }

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, [isHighlighting, highlightColor]);

  if (!course || !lesson) {
    return null;
  }

  // Text Selection and Highlighting
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = highlightColor;
      span.style.padding = '2px 0';
      span.style.borderRadius = '3px';
      span.className = 'highlighted-text';
      
      try {
        range.surroundContents(span);
      } catch (e) {
        // If can't wrap (complex selection), create new span
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
      }
      
      selection.removeAllRanges();
    }
  };

  // Clear all highlights
  const clearHighlights = () => {
    if (contentRef.current) {
      const highlights = contentRef.current.querySelectorAll('.highlighted-text');
      highlights.forEach(span => {
        const parent = span.parentNode;
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
      });
    }
  };

  // Change highlight color
  const changeHighlightColor = (color) => {
    setHighlightColor(color);
    if (contentRef.current) {
      const highlights = contentRef.current.querySelectorAll('.highlighted-text');
      highlights.forEach(span => {
        span.style.backgroundColor = color;
      });
    }
  };

  // Text-to-Speech
  const handlePlayAudio = () => {
    if (isPlaying) {
      synth.current.cancel();
      setIsPlaying(false);
    } else {
      utteranceRef.current = new SpeechSynthesisUtterance(lesson.content);
      utteranceRef.current.rate = 1;
      utteranceRef.current.pitch = 1;
      utteranceRef.current.volume = 1;
      utteranceRef.current.onend = () => setIsPlaying(false);
      
      synth.current.speak(utteranceRef.current);
      setIsPlaying(true);
    }
  };

  // Handle quiz answer
  const handleAnswerSelect = (index) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    const correct = index === lesson.quiz.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  // Navigation
  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
      setSelectedAnswer(null);
      setShowResult(false);
      clearHighlights();
      window.scrollTo(0, 0);
    } else {
      alert('Course completed! 🎉');
      navigate('/courses');
    }
  };

  const handlePreviousLesson = () => {
    if (previousLesson) {
      navigate(`/course/${courseId}/lesson/${previousLesson.id}`);
      setSelectedAnswer(null);
      setShowResult(false);
      clearHighlights();
      window.scrollTo(0, 0);
    }
  };

  // Highlight colors
  const highlightColors = [
    { color: '#fef08a', name: 'Yellow' },
    { color: '#86efac', name: 'Green' },
    { color: '#93c5fd', name: 'Blue' },
    { color: '#fca5a5', name: 'Red' },
    { color: '#d8b4fe', name: 'Purple' },
    { color: '#fcd34d', name: 'Orange' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors`}>
      
      {/* Top Control Bar */}
      <div className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Back Button */}
            <button
              onClick={() => navigate('/courses')}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors`}
            >
              <ArrowLeft className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
            </button>

            {/* Reading Controls */}
            <div className="flex items-center gap-2">
              
              {/* Volume Icon */}
              <button
                onClick={handlePlayAudio}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                title={isPlaying ? 'Stop Audio' : 'Play Audio'}
              >
                {isPlaying ? (
                  <VolumeX className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                ) : (
                  <Volume2 className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                )}
              </button>

              {/* Font Size Controls */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className={`px-3 py-2 text-sm font-medium ${
                    isDarkMode ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'
                  } rounded-lg transition-colors`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                  className={`px-3 py-2 text-sm font-medium ${
                    isDarkMode ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'
                  } rounded-lg transition-colors`}
                >
                  A+
                </button>
              </div>

              {/* Bold Toggle */}
              <button
                className={`px-3 py-2 rounded-lg font-bold ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                } transition-colors`}
                title="Bold Text"
              >
                A
              </button>

              {/* Light/Dark circles */}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDarkMode(false)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    !isDarkMode ? 'bg-white border-gray-900' : 'bg-white border-gray-300'
                  }`}
                  title="Light Mode"
                />
                <button
                  onClick={() => setIsDarkMode(true)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    isDarkMode ? 'bg-gray-900 border-white' : 'bg-gray-900 border-gray-300'
                  }`}
                  title="Dark Mode"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        
        {/* Lesson Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={lessonId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
            } rounded-3xl p-8 md:p-12 shadow-sm mb-8`}
          >
            
            {/* Lesson Title */}
            <h1 
              className={`font-black mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              style={{ fontSize: `${fontSize * 2}px` }}
            >
              {lesson.title}
            </h1>

            {/* Lesson Text - With ref for highlighting */}
            <div
              ref={contentRef}
              className={`mb-8 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} ${
                isHighlighting ? 'cursor-text select-text' : ''
              }`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: 1.8,
                letterSpacing: '0.03em',
                userSelect: isHighlighting ? 'text' : 'auto',
              }}
            >
              {lesson.content}
            </div>

            {/* Audio & Highlight Controls */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handlePlayAudio}
                  className="flex items-center justify-center gap-3 px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white rounded-2xl font-medium transition-all shadow-sm"
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-5 h-5" />
                      Stop Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5" />
                      Play Audio
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsHighlighting(!isHighlighting)}
                  className={`flex items-center justify-center gap-3 px-6 py-3 rounded-2xl font-medium transition-all shadow-sm ${
                    isHighlighting
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-teal-400 hover:bg-teal-500 text-white'
                  }`}
                >
                  <Highlighter className="w-5 h-5" />
                  {isHighlighting ? 'Highlighting Active' : 'Highlight Text'}
                </button>

                {isHighlighting && (
                  <button
                    onClick={clearHighlights}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl font-medium transition-all shadow-sm"
                  >
                    Clear Highlights
                  </button>
                )}
              </div>

              {/* Highlight Color Picker */}
              {isHighlighting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl"
                >
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Highlight Color:
                  </span>
                  {highlightColors.map(({ color, name }) => (
                    <button
                      key={color}
                      onClick={() => changeHighlightColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                        highlightColor === color ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={name}
                    />
                  ))}
                </motion.div>
              )}

              {/* Highlighting Instructions */}
              {isHighlighting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900 rounded-xl"
                >
                  <span className="text-blue-800 dark:text-blue-200 text-sm">
                    💡 <strong>Tip:</strong> Select any text in the lesson to highlight it. Choose a color above to change highlight color.
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quiz Section */}
        {lesson.quiz && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
            } rounded-3xl p-8 md:p-12 shadow-sm`}
          >
            
            <h2 
              className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Check Your Understanding
            </h2>

            <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {lesson.quiz.question}
            </p>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {lesson.quiz.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: showResult ? 1 : 1.02 }}
                  whileTap={{ scale: showResult ? 1 : 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`
                    p-6 rounded-2xl text-left font-medium transition-all
                    ${!showResult && 'hover:shadow-md'}
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}
                    ${selectedAnswer === index && !showResult 
                      ? 'bg-gray-200 dark:bg-gray-700 shadow-md' 
                      : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }
                    ${showResult && index === lesson.quiz.correctAnswer 
                      ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500' 
                      : ''
                    }
                    ${showResult && selectedAnswer === index && !isCorrect 
                      ? 'bg-red-100 dark:bg-red-900 border-2 border-red-500' 
                      : ''
                    }
                    ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {showResult && index === lesson.quiz.correctAnswer && (
                      <span className="text-green-600 dark:text-green-400 text-2xl">✓</span>
                    )}
                    {showResult && selectedAnswer === index && !isCorrect && (
                      <span className="text-red-600 dark:text-red-400 text-2xl">✗</span>
                    )}
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Explanation */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`p-6 rounded-2xl ${
                  isCorrect 
                    ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700' 
                    : 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700'
                }`}
              >
                <p className={`font-semibold mb-2 ${
                  isCorrect ? 'text-green-800 dark:text-green-200' : 'text-blue-800 dark:text-blue-200'
                }`}>
                  {isCorrect ? '✓ Correct! Well done!' : 'ℹ️ Explanation:'}
                </p>
                <p className={`text-sm ${
                  isCorrect ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'
                }`}>
                  {lesson.quiz.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePreviousLesson}
            disabled={!previousLesson}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              previousLesson
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Previous Lesson
          </button>

          <button
            onClick={handleNextLesson}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-all shadow-sm"
          >
            {nextLesson ? 'Next Lesson' : 'Complete Course'}
          </button>
        </div>
      </div>
    </div>
  );
}