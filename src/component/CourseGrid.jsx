import CourseCard from '../component/CourseCard.jsx';
import { motion } from 'framer-motion';

export default function CourseGrid({ courses }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <CourseCard course={course} />
        </motion.div>
      ))}
    </div>
  );
}