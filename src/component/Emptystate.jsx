import { motion } from 'framer-motion';

export default function EmptyState({ 
  icon = '📭',
  title,
  description,
  action = null,
  className = ''
}) {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`text-center py-12 sm:py-16 px-4 sm:px-6 ${className}`}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="text-5xl sm:text-7xl mb-4 sm:mb-6"
      >
        <span>{icon}</span>
      </motion.div>

      {/* Title */}
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto mb-6 sm:mb-8">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={action.onClick}
          className="
            px-6 sm:px-8 py-3 sm:py-4 
            bg-teal-600 hover:bg-teal-700 
            text-white text-base sm:text-lg font-medium 
            rounded-xl shadow-sm hover:shadow-md
            transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-teal-200
            active:scale-95
          "
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}