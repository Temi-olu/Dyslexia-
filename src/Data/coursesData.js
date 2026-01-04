export const coursesData = [
  {
    id: 'basic-reading-1',
    title: 'Basic Reading Skills',
    description: 'Learn the fundamentals of reading with engaging exercises designed to build confidence.',
    image: '/images/basic-reading.jpg',
    grade: 'mono',
    category: 'reading',
    difficulty: 'beginner',
    progress: 0,
    isStarted: false,
    isCompleted: false,
    totalLessons: 5,
    
    // LESSONS ARRAY - This is the key part!
    lessons: [
      {
        id: 'lesson-1',
        title: 'Lesson 1 – Letter Sounds',
        order: 1,
        content: `This lesson focuses on the fundamental sounds of letters. We will explore how each letter makes a unique sound and how these sounds combine to form words. The text is specifically formatted with increased spacing between letters and lines, and a high-contrast background to improve readability and reduce visual stress. This will help you focus on the content and learn more effectively.`,
        audioUrl: null, // Optional: URL to pre-recorded audio
        quiz: {
          question: "What sound does the letter 'A' make in the word 'apple'?",
          options: [
            "The 'ay' sound as in 'ape'",
            "The 'ah' sound as in 'father'",
            "The short 'a' sound as in 'cat'",
            "The 'o' sound as in 'all'"
          ],
          correctAnswer: 2, // Index of correct option
          explanation: "The letter 'A' makes the short 'a' sound in 'apple', like in 'cat'."
        },
        isCompleted: false,
      },
      {
        id: 'lesson-2',
        title: 'Lesson 2 – Vowel Sounds',
        order: 2,
        content: `Vowels are special letters that can make many different sounds. In this lesson, we'll focus on the five main vowels: A, E, I, O, and U. Each vowel can make a short sound and a long sound. Understanding these sounds will help you read and spell words more easily.`,
        audioUrl: null,
        quiz: {
          question: "Which of these is a vowel?",
          options: [
            "B",
            "E",
            "T",
            "P"
          ],
          correctAnswer: 1,
          explanation: "E is a vowel. The five vowels are A, E, I, O, and U."
        },
        isCompleted: false,
      },
      {
        id: 'lesson-3',
        title: 'Lesson 3 – Consonant Blends',
        order: 3,
        content: `Consonant blends are two or more consonants that appear together in a word. Each letter keeps its own sound, but they blend together smoothly. Common blends include 'bl', 'cr', 'st', and 'tr'. Let's practice identifying and reading these blends.`,
        audioUrl: null,
        quiz: {
          question: "Which word starts with a consonant blend?",
          options: [
            "cat",
            "blend",
            "dog",
            "hat"
          ],
          correctAnswer: 1,
          explanation: "'Blend' starts with 'bl', which is a consonant blend."
        },
        isCompleted: false,
      },
      {
        id: 'lesson-4',
        title: 'Lesson 4 – Simple Words',
        order: 4,
        content: `Now that you know letter sounds and blends, let's put them together to read simple words. We'll start with three-letter words called CVC words (Consonant-Vowel-Consonant), like 'cat', 'dog', 'sun', and 'hop'.`,
        audioUrl: null,
        quiz: {
          question: "Which is a CVC word?",
          options: [
            "tree",
            "cat",
            "door",
            "street"
          ],
          correctAnswer: 1,
          explanation: "'Cat' follows the CVC pattern: C (c) + V (a) + C (t)."
        },
        isCompleted: false,
      },
      {
        id: 'lesson-5',
        title: 'Lesson 5 – Practice Reading',
        order: 5,
        content: `Congratulations! You've learned the basics of reading. In this final lesson, we'll practice reading short sentences using all the skills you've learned. Take your time and sound out each word carefully.`,
        audioUrl: null,
        quiz: {
          question: "Complete this sentence: The ___ runs fast.",
          options: [
            "cat",
            "and",
            "is",
            "the"
          ],
          correctAnswer: 0,
          explanation: "'The cat runs fast' is a complete sentence that makes sense."
        },
        isCompleted: false,
      }
    ]
  },
  
  {
    id: 'phonics-training-1',
    title: 'Phonics Training',
    description: 'Master the sounds of letters and letter combinations to improve your reading and spelling.',
    image: '/images/phonics.jpg',
    grade: 'mono',
    category: 'phonics',
    difficulty: 'beginner',
    progress: 0,
    isStarted: false,
    isCompleted: false,
    totalLessons: 4,
    lessons: [
      {
        id: 'phonics-lesson-1',
        title: 'Introduction to Phonics',
        order: 1,
        content: `Phonics is the relationship between sounds and their spellings. Learning phonics helps you decode words and read more fluently.`,
        audioUrl: null,
        quiz: {
          question: "What is phonics?",
          options: [
            "The study of grammar",
            "The relationship between sounds and spellings",
            "Learning vocabulary",
            "Writing stories"
          ],
          correctAnswer: 1,
          explanation: "Phonics teaches us how sounds relate to letters and spelling patterns."
        },
        isCompleted: false,
      },
      // ... more lessons
    ]
  },
  
  // ... more courses
];

// Helper function to get a single course by ID
export function getCourseById(courseId) {
  return coursesData.find(course => course.id === courseId);
}

// Helper function to get a specific lesson
export function getLessonById(courseId, lessonId) {
  const course = getCourseById(courseId);
  if (!course) return null;
  return course.lessons.find(lesson => lesson.id === lessonId);
}

// Helper function to get next lesson
export function getNextLesson(courseId, currentLessonId) {
  const course = getCourseById(courseId);
  if (!course) return null;
  
  const currentIndex = course.lessons.findIndex(l => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === course.lessons.length - 1) {
    return null; // No next lesson
  }
  
  return course.lessons[currentIndex + 1];
}

// Helper function to get previous lesson
export function getPreviousLesson(courseId, currentLessonId) {
  const course = getCourseById(courseId);
  if (!course) return null;
  
  const currentIndex = course.lessons.findIndex(l => l.id === currentLessonId);
  if (currentIndex <= 0) {
    return null; // No previous lesson
  }
  
  return course.lessons[currentIndex - 1];
}