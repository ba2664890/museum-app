import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-amber-200 rounded-full" />
        
        {/* Inner spinning part */}
        <div className="absolute inset-0 border-4 border-transparent border-t-amber-600 rounded-full" />
        
        {/* Center dot */}
        <div className="absolute inset-2 bg-amber-600 rounded-full" />
      </motion.div>
    </div>
  )
}

export default LoadingSpinner