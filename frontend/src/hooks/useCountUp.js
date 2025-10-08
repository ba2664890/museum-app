import { useState, useEffect } from 'react'

export const useCountUp = (endValue, duration = 2000) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(endValue) || 0
    
    if (start === end) return

    let startTime = null

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      const currentCount = Math.floor(start + (end - start) * easeOut)
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)

    return () => {
      // Cleanup if needed
    }
  }, [endValue, duration])

  return count
}