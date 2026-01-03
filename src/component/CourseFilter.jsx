import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CourseFilters({
  selectedGrade,
  onGradeChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
}) {
  const grades = [
    { id: 'all', label: 'All Levels', emoji: '📚' },
    { id: 'mono', label: 'Mono Syllable', emoji: '🧸', subtitle: 'Ages 5-8' },
    { id: 'cat', label: 'CAT Level', emoji: '📖', subtitle: 'Ages 9-12' },
    { id: 'adult', label: 'Adult', emoji: '🎓', subtitle: 'Ages 13+' },
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'reading', label: 'Reading' },
    { id: 'phonics', label: 'Phonics' },
    { id: 'spelling', label: 'Spelling' },
    { id: 'writing', label: 'Writing' },
    { id: 'vocabulary', label: 'Vocabulary' },
  ];

  const difficulties = [
    { id: 'all', label: 'All Difficulties' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="mb-8 space-y-6">
      
      {/* Search Bar + Quick Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for a course..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-6 py-3 border border-gray-300 rounded-xl bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* Difficulty Dropdown */}
        <select
          value={selectedDifficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="px-6 py-3 border border-gray-300 rounded-xl bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all cursor-pointer"
        >
          {difficulties.map((diff) => (
            <option key={diff.id} value={diff.id}>
              {diff.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grade/Level Selector - Prominent Pills */}
      <div className="flex flex-wrap gap-3">
        {grades.map((grade) => (
          <motion.button
            key={grade.id}
            onClick={() => onGradeChange(grade.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all
              ${selectedGrade === grade.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300'
              }
            `}
          >
            <span className="text-xl mr-2">{grade.emoji}</span>
            <span>{grade.label}</span>
            {grade.subtitle && (
              <span className={`ml-2 text-sm ${
                selectedGrade === grade.id ? 'text-primary-100' : 'text-gray-500'
              }`}>
                ({grade.subtitle})
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}