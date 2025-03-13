"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowUpRight, Activity } from "lucide-react"

export default function Component() {
  const [progress, setProgress] = useState(0)
  const [pulseOpacity, setPulseOpacity] = useState(0.5)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Current progress value (20%)
  const currentValue = 20

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(currentValue)
    }, 800)

    return () => clearTimeout(timer)
  }, [currentValue])

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseOpacity((prev) => (prev === 0.5 ? 0.8 : 0.5))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Draw data points on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Generate data points (simulating past 20 days)
    const dataPoints = Array.from({ length: 20 }, (_, i) => ({
      x: i,
      y: i + 1,
    }))

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = "rgba(16, 185, 129, 0.6)"
    ctx.lineWidth = 2

    dataPoints.forEach((point, index) => {
      const x = (point.x / 19) * canvas.offsetWidth
      const y = canvas.offsetHeight - (point.y / 20) * canvas.offsetHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    dataPoints.forEach((point) => {
      const x = (point.x / 19) * canvas.offsetWidth
      const y = canvas.offsetHeight - (point.y / 20) * canvas.offsetHeight

      ctx.beginPath()
      ctx.fillStyle = "rgba(16, 185, 129, 0.8)"
      ctx.arc(x, y, 2, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [])

  // Calculate days until completion
  const daysRemaining = 100 - currentValue

  return (
    <div className="w-full max-w-md mx-auto bg-black text-emerald-500 p-6 rounded-xl border border-emerald-900/50 shadow-lg">
      <div className="space-y-6">
        {/* Main progress circle */}
        <div className="relative flex items-center justify-center">
          {/* Background pulse */}
          <div
            className="absolute inset-0 rounded-full bg-emerald-500/10 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: pulseOpacity }}
          />

          {/* Progress circle */}
          <div className="relative h-64 w-64">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                className="text-emerald-900/20"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />

              {/* Progress circle */}
              <circle
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                strokeDasharray={264}
                strokeDashoffset={264 - (progress / 100) * 264}
                transform="rotate(-90 50 50)"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-mono tabular-nums">{currentValue}</div>
              <div className="text-xs text-emerald-500/70 mt-1 font-mono">UNIT: %</div>
              <div className="flex items-center gap-1 mt-3 text-xs text-emerald-500/70 font-mono">
                <Activity className="h-3 w-3" />
                <span>RATE: 1.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data visualization */}
        <div className="h-24 w-full">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-emerald-900/20 p-3 rounded-lg">
            <div className="text-xs text-emerald-500/70 font-mono">DELTA</div>
            <div className="text-xl font-mono tabular-nums">1.00</div>
          </div>
          <div className="bg-emerald-900/20 p-3 rounded-lg">
            <div className="text-xs text-emerald-500/70 font-mono">CYCLE</div>
            <div className="text-xl font-mono tabular-nums">{currentValue}</div>
          </div>
          <div className="bg-emerald-900/20 p-3 rounded-lg">
            <div className="text-xs text-emerald-500/70 font-mono">REMAIN</div>
            <div className="text-xl font-mono tabular-nums">{daysRemaining}</div>
          </div>
        </div>

        {/* Vector indicator */}
        <div className="flex items-center justify-between bg-emerald-900/20 p-3 rounded-lg">
          <div className="text-xs text-emerald-500/70 font-mono">VECTOR</div>
          <div className="flex items-center">
            <span className="text-xl font-mono tabular-nums mr-2">[0.2, 0.01, 1.0]</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

