"use client"

import { useEffect, useState } from "react"
import { cva } from "class-variance-authority"
import { ArrowRight } from "lucide-react"

import { Progress } from "@/components/ui/progress"

const progressColorVariants = cva("", {
  variants: {
    color: {
      low: "bg-red-500",
      medium: "bg-yellow-500",
      high: "bg-green-500",
    },
  },
  defaultVariants: {
    color: "low",
  },
})

interface ProgressMeterProps {
  value: number
}

export function ProgressMeter({ value }: ProgressMeterProps) {
  const [progress, setProgress] = useState(0)

  // Determine color based on progress value
  const getColorVariant = (value: number) => {
    if (value < 30) return "low"
    if (value < 70) return "medium"
    return "high"
  }

  const colorVariant = getColorVariant(value)

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value)
    }, 100)

    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${progressColorVariants({ color: colorVariant })}`} />
          <span className="font-medium">{value}% Complete</span>
        </div>
        <div className="text-sm text-muted-foreground">{100 - value}% remaining</div>
      </div>

      <div className="relative">
        <Progress
          value={progress}
          className="h-4 w-full"
          indicatorClassName={progressColorVariants({ color: colorVariant })}
        />

        <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${progressColorVariants({ color: colorVariant })} shadow-md`}
          >
            <ArrowRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Start</span>
        <span>Finish</span>
      </div>
    </div>
  )
}

