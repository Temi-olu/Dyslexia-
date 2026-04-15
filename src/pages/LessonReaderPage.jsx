import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Highlighter, Moon, Sun, Pause, Play } from 'lucide-react';
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
  const [isPaused, setIsPaused] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [highlightColor, setHighlightColor] = useState('#fef08a'); // Yellow
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // NEW: Audio-visual sync states
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [words, setWords] = useState([]);
  const [readingSpeed, setReadingSpeed] = useState(1); // Speech rate
  const [autoHighlightEnabled, setAutoHighlightEnabled] = useState(true);

  // Refs
  const synth = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const contentRef = useRef(null);
  const wordTimerRef = useRef(null);
  const wordRefs = useRef([]);

  // Split content into words on component mount
  useEffect(() => {
    if (lesson && lesson.content) {
      // Split by spaces but preserve punctuation
      const wordArray = lesson.content.split(/(\s+)/);
      setWords(wordArray.filter(word => word.trim().length > 0));
    }
  }, [lesson]);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
      if (wordTimerRef.current) {
        clearTimeout(wordTimerRef.current);
      }
    };
  }, []);

  if (!course || !lesson) {
    return null;
  }

  // Text Selection and Highlighting (Manual)
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

  // Clear all manual highlights
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

  // NEW: Enhanced Text-to-Speech with synchronized highlighting
  const handlePlayAudio = () => {
    if (isPlaying) {
      synth.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
      if (wordTimerRef.current) {
        clearTimeout(wordTimerRef.current);
      }
    } else {
      startAudioVisualReading();
    }
  };

  // NEW: Pause/Resume functionality
  const handlePauseResume = () => {
    if (isPaused) {
      synth.current.resume();
      setIsPaused(false);
      // Resume word highlighting
      continueWordHighlighting(currentWordIndex);
    } else {
      synth.current.pause();
      setIsPaused(true);
    }
  };

  // NEW: Start synchronized audio-visual reading
  const startAudioVisualReading = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentWordIndex(0);

    // Create speech synthesis
    utteranceRef.current = new SpeechSynthesisUtterance(lesson.content);
    utteranceRef.current.rate = readingSpeed;
    utteranceRef.current.pitch = 1;
    utteranceRef.current.volume = 1;

    // Handle speech end
    utteranceRef.current.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
      if (wordTimerRef.current) {
        clearTimeout(wordTimerRef.current);
      }
    };

    // Handle speech errors
    utteranceRef.current.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };

    // Start speaking
    synth.current.speak(utteranceRef.current);

    // Start word-by-word highlighting
    if (autoHighlightEnabled) {
      highlightWordsSequentially(0);
    }
  };

  // NEW: Highlight words sequentially as they're spoken
  const highlightWordsSequentially = (startIndex = 0) => {
    const totalWords = words.length;
    
    // Calculate approximate time per word based on speech rate
    // Average reading: 200 words per minute at rate 1.0
    // Adjust based on actual rate
    const baseTimePerWord = (60 / 200) * 1000; // milliseconds
    const adjustedTime = baseTimePerWord / readingSpeed;

    const highlightNextWord = (index) => {
      if (index >= totalWords || !isPlaying) {
        setCurrentWordIndex(-1);
        return;
      }

      setCurrentWordIndex(index);

      // Scroll word into view smoothly
      if (wordRefs.current[index]) {
        wordRefs.current[index].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }

      // Schedule next word
      wordTimerRef.current = setTimeout(() => {
        highlightNextWord(index + 1);
      }, adjustedTime);
    };

    highlightNextWord(startIndex);
  };

  // NEW: Continue highlighting from current position (for pause/resume)
  const continueWordHighlighting = (fromIndex) => {
    if (autoHighlightEnabled) {
      highlightWordsSequentially(fromIndex);
    }
  };

  // NEW: Change reading speed
  const changeReadingSpeed = (speed) => {
    setReadingSpeed(speed);
    
    // If currently playing, restart with new speed
    if (isPlaying) {
      const currentIndex = currentWordIndex;
      synth.current.cancel();
      
      // Restart from current position
      setTimeout(() => {
        const remainingText = words.slice(currentIndex).join(' ');
        utteranceRef.current = new SpeechSynthesisUtterance(remainingText);
        utteranceRef.current.rate = speed;
        utteranceRef.current.pitch = 1;
        utteranceRef.current.volume = 1;
        utteranceRef.current.onend = () => {
          setIsPlaying(false);
          setCurrentWordIndex(-1);
        };
        synth.current.speak(utteranceRef.current);
        highlightWordsSequentially(currentIndex);
      }, 100);
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
      // Stop audio if playing
      if (isPlaying) {
        synth.current.cancel();
        setIsPlaying(false);
      }
      
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`);
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentWordIndex(-1);
      clearHighlights();
      window.scrollTo(0, 0);
    } else {
      alert('Course completed! 🎉');
      navigate('/courses');
    }
  };

  const handlePreviousLesson = () => {
    if (previousLesson) {
      // Stop audio if playing
      if (isPlaying) {
        synth.current.cancel();
        setIsPlaying(false);
      }
      
      navigate(`/course/${courseId}/lesson/${previousLesson.id}`);
      setSelectedAnswer(null);
      setShowResult(false);
      setCurrentWordIndex(-1);
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

  // Reading speed options
  const speedOptions = [
    { value: 0.5, label: '0.5x Slow' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x Normal' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x Fast' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors`}>
      
      {/* Top Control Bar */}
      <div className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            
            {/* Back Button */}
            <button
              onClick={() => navigate('/courses')}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors`}
            >
              <ArrowLeft className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              <span className={`${isDarkMode ? 'text-white' : 'text-gray-700'} font-medium`}>
                Back to Lessons
              </span>
            </button>

            {/* Reading Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Audio Control Buttons */}
              <button
                onClick={handlePlayAudio}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                title={isPlaying ? 'Stop Audio' : 'Play Audio'}
              >
                {isPlaying ? (
                  <VolumeX className={`w-6 h-6 ${isDarkMode ? 'text-red-500' : 'text-red-600'}`} />
                ) : (
                  <Volume2 className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                )}
              </button>

              {/* Pause/Resume Button (shows when playing) */}
              {isPlaying && (
                <button
                  onClick={handlePauseResume}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? (
                    <Play className={`w-6 h-6 ${isDarkMode ? 'text-green-500' : 'text-green-600'}`} />
                  ) : (
                    <Pause className={`w-6 h-6 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'}`} />
                  )}
                </button>
              )}

              {/* Reading Speed Selector */}
              <select
                value={readingSpeed}
                onChange={(e) => changeReadingSpeed(parseFloat(e.target.value))}
                className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
                title="Reading Speed"
              >
                {speedOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Font Size Controls */}
              <div className={`flex items-center gap-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className={`px-3 py-2 text-sm font-medium ${
                    isDarkMode ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'
                  } rounded-lg transition-colors`}
                >
                  A-
                </button>
                <span className={`px-2 text-sm ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  {fontSize}px
                </span>
                <button
                  onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                  className={`px-3 py-2 text-sm font-medium ${
                    isDarkMode ? 'text-white hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-200'
                  } rounded-lg transition-colors`}
                >
                  A+
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Playing Status Indicator */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mt-3 p-3 rounded-lg ${
                isPaused 
                  ? 'bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700' 
                  : 'bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  isPaused 
                    ? 'text-yellow-800 dark:text-yellow-200' 
                    : 'text-green-800 dark:text-green-200'
                }`}>
                  {isPaused ? '⏸️ Paused' : '🎧 Now Reading'}
                  {autoHighlightEnabled && ' - Words highlighted as they\'re spoken'}
                </span>
                <button
                  onClick={() => setAutoHighlightEnabled(!autoHighlightEnabled)}
                  className={`text-xs px-3 py-1 rounded-full ${
                    autoHighlightEnabled
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {autoHighlightEnabled ? 'Auto-Highlight ON' : 'Auto-Highlight OFF'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={lessonId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Lesson Header */}
            <div className="mb-8">
              <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {lesson.title}
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {course.title}
              </p>
            </div>

            {/* Lesson Content with Word-by-Word Highlighting */}
            <div
              ref={contentRef}
              className={`${
                isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
              } rounded-3xl p-8 md:p-12 shadow-sm mb-6 ${
                isHighlighting ? 'cursor-text select-text' : ''
              }`}
            >
              <div
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.8,
                  letterSpacing: '0.03em',
                  userSelect: isHighlighting ? 'text' : 'auto',
                }}
              >
                {/* Render words with individual highlighting */}
                {words.map((word, index) => (
                  <span
                    key={index}
                    ref={el => wordRefs.current[index] = el}
                    className={`inline-block transition-all duration-200 ${
                      currentWordIndex === index && autoHighlightEnabled
                        ? 'bg-yellow-300 dark:bg-yellow-600 px-1 rounded scale-110 font-bold shadow-lg'
                        : ''
                    }`}
                    style={{
                      marginRight: '0.25em',
                      transform: currentWordIndex === index ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Audio & Highlight Controls */}
            <div className="space-y-4 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handlePlayAudio}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all shadow-sm ${
                    isPlaying
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-5 h-5" />
                      Stop Audio
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5" />
                      Play Audio with Highlighting
                    </>
                  )}
                </button>

                {isPlaying && (
                  <button
                    onClick={handlePauseResume}
                    className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all shadow-sm ${
                      isPaused
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    }`}
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-5 h-5" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setIsHighlighting(!isHighlighting)}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all shadow-sm ${
                    isHighlighting
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                  }`}
                >
                  <Highlighter className="w-5 h-5" />
                  {isHighlighting ? 'Highlighting Active' : 'Manual Highlight'}
                </button>

                {isHighlighting && (
                  <button
                    onClick={clearHighlights}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl font-medium transition-all shadow-sm"
                  >
                    Clear Manual Highlights
                  </button>
                )}
              </div>

              {/* Feature Explanation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl"
              >
                <span className="text-2xl">💡</span>
                <div className="flex-1">
                  <p className="text-blue-800 dark:text-blue-200 text-sm font-medium mb-2">
                    <strong>Audio-Visual Learning Mode:</strong>
                  </p>
                  <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                    <li>✓ Click "Play Audio with Highlighting" to start synchronized reading</li>
                    <li>✓ Words will be highlighted in <strong className="bg-yellow-200 px-1 rounded">yellow</strong> as they're spoken</li>
                    <li>✓ Adjust reading speed (0.5x - 1.5x) to match your comfort level</li>
                    <li>✓ Use Pause/Resume to control playback</li>
                    <li>✓ Manual highlighting tool available for marking important sections</li>
                  </ul>
                </div>
              </motion.div>

              {/* Highlight Color Picker (for manual highlighting) */}
              {isHighlighting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl"
                >
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Manual Highlight Color:
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

              {/* Manual Highlighting Instructions */}
              {isHighlighting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900 rounded-xl"
                >
                  <span className="text-purple-800 dark:text-purple-200 text-sm">
                    📌 <strong>Manual Highlighting:</strong> Select any text in the lesson to permanently highlight it. Choose a color above.
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
            ← Previous Lesson
          </button>

          <button
            onClick={handleNextLesson}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-all shadow-sm"
          >
            {nextLesson ? 'Next Lesson →' : 'Complete Course 🎉'}
          </button>
        </div>
      </div>
    </div>
  );
}