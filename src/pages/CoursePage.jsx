// pages/CoursesPage.jsx
import { useState, useEffect } from 'react';
import Navbar from '../component/Navbar';
import CourseFilter from '../component/CourseFilter';
import CourseGrid from '../component/CourseGrid';
import { coursesData } from '../Data/Lessondata';

export default function CoursesPage() {
  const [selectedGrade, setSelectedGrade] = useState('all'); // 'all', 'mono', 'cat', 'adult'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Filter courses based on all criteria
  useEffect(() => {
    let filtered = coursesData;

    // Grade filter
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(course => course.grade === selectedGrade);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    setFilteredCourses(filtered);
  }, [selectedGrade, searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showAuthButtons={false} userAvatar="/avatar.jpg" userName="Temi" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">Available Courses</h1>
          <body className="text-xl text-gray-600">
            Explore new skills and continue your learning journey.
          </body>
        </div>

        {/* Filters */}
        <CourseFilter
          selectedGrade={selectedGrade}
          onGradeChange={setSelectedGrade}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
        />

        Courses Grid or Empty State
        {filteredCourses.length > 0 ? (
          <CourseGrid courses={filteredCourses} />
        ) : (
          <EmptyState
            icon="🔍"
            title="No courses found"
            description="Try adjusting your filters or search terms"
            action={{
              label: "Clear Filters",
              onClick: () => {
                setSelectedGrade('all');
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }
            }}
          />
        )}
      </div>
    </div>
  );
}