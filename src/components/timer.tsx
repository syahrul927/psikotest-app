"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface TimerProps {
  seconds: number
  onTimeUp: () => void
  isActive: boolean
}

export default function Timer({ seconds: initialSeconds, onTimeUp, isActive }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    setSeconds(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            if (interval) clearInterval(interval)
            onTimeUp()
            return 0
          }
          return prevSeconds - 1
        })
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, onTimeUp])

  // Format seconds to MM:SS
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`

  // Calculate percentage for progress indicator
  const percentage = (seconds / initialSeconds) * 100

  return (
    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border shadow-sm">
      <Clock className="h-4 w-4 text-gray-600" />
      <div className="text-sm font-medium text-gray-900">{formattedTime}</div>
      <div className="w-12 sm:w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            percentage > 50 ? "bg-gray-700" : percentage > 20 ? "bg-gray-500" : "bg-gray-900"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
