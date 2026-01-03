
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const {
    id,
    title,
    description,
    image,
    progress = 0,
    isStarted = false,
    isCompleted = false,
    grade,
    difficulty,
    category,
  } = course;

  // Grade badge colors
  const gradeBadgeColors = {
    mono: 'bg-pink-100 text-pink-700',
    cat: 'bg-blue-100 text-blue-700',
    adult: 'bg-purple-100 text-purple-700',
  };

  // Difficulty badge colors
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
    >
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${gradeBadgeColors[grade]}`}>
            {grade === 'mono' ? 'Mono' : grade === 'cat' ? 'CAT' : 'Adult'}
          </span>
        </div>

        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
            ✓
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        
        {/* Category & Difficulty */}
        <div className="flex items-center gap-2 mb-3">
          <Caption className="text-gray-500">{category}</Caption>
          <span className="text-gray-300">•</span>
          <span className={`text-xs font-medium px-2 py-1 rounded ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>

        {/* Title */}
        <h4 className="mb-2 line-clamp-2">{title}</h4>

        {/* Description */}
        <body className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </body>

        {/* Progress Bar (if started) */}
        {isStarted && !isCompleted && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <Caption>Progress</Caption>
              <Caption className="font-semibold">{progress}%</Caption>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary-600 rounded-full"
              />
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Link to={`/lesson/${id}`}>
          <Button
            variant={isStarted ? 'accent' : 'primary'}
            size="md"
            fullWidth
          >
            {isCompleted ? 'Review' : isStarted ? 'Continue Learning' : 'Start Course'}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}