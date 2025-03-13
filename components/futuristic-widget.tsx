"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Activity, Zap, Shield } from "lucide-react"

interface FuturisticWidgetProps {
  isVisible: boolean
  mousePosition: { x: number; y: number }
  containerDimensions: { width: number; height: number }
}

export default function FuturisticWidget({ isVisible, mousePosition, containerDimensions }: FuturisticWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(1000)
  const [hoverState, setHoverState] = useState(false)

  // Calculate distance between mouse and widget center
  useEffect(() => {
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect()
      const widgetCenterX = rect.left + rect.width / 2
      const widgetCenterY = rect.top + rect.height / 2

      const dx = mousePosition.x - containerDimensions.width / 2
      const dy = mousePosition.y - containerDimensions.height / 2

      const distance = Math.sqrt(dx * dx + dy * dy)
      setDistance(distance)
    }
  }, [mousePosition, containerDimensions])

  // Proximity factor (1 when far, 0 when close)
  const proximityFactor = Math.min(Math.max(distance / 300, 0), 1)

  // Dynamic glow intensity based on proximity
  const glowIntensity = (1 - proximityFactor) * 0.5

  // Animation variants for the widget
  const widgetVariants = {
    hidden: {
      opacity: 0.2,
      scale: 0.98,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier
        opacity: { duration: 1.5 },
        filter: { duration: 1.8 },
      },
    },
  }

  // Animation variants for the widget sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + custom * 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  }

  return (
    <motion.div
      ref={widgetRef}
      className="relative w-full max-w-md rounded-xl overflow-hidden"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={widgetVariants}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
      style={{
        boxShadow: `0 0 ${20 + glowIntensity * 30}px ${glowIntensity * 15}px rgba(99, 102, 241, ${0.2 + glowIntensity * 0.3})`,
        transform: `
          scale(${hoverState ? 1.02 : 1})
          perspective(1000px)
          rotateX(${(mousePosition.y - containerDimensions.height / 2) * 0.01}deg)
          rotateY(${-(mousePosition.x - containerDimensions.width / 2) * 0.01}deg)
        `,
        transition: "transform 0.2s ease-out, box-shadow 0.3s ease-out",
      }}
    >
      {/* Background gradient with dynamic glow */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-indigo-900/30"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at ${(mousePosition.x / containerDimensions.width) * 100}% ${(mousePosition.y / containerDimensions.height) * 100}%, 
              rgba(99, 102, 241, ${0.15 + glowIntensity * 0.2}) 0%, 
              transparent 70%
            ),
            linear-gradient(to bottom right, #1e1b4b, #111827, #0f172a)
          `,
        }}
      ></div>

      {/* Widget content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-6" variants={sectionVariants} custom={0}>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse"></div>
            <h3 className="text-lg font-medium text-indigo-300">System Status</h3>
          </div>
          <div className="text-xs text-indigo-400 opacity-70">{new Date().toLocaleTimeString()}</div>
        </motion.div>

        {/* Main content */}
        <motion.div className="space-y-4 mb-6" variants={sectionVariants} custom={1}>
          {/* Status indicators */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Network", value: "98.2%", icon: <Activity className="h-4 w-4" />, color: "bg-emerald-500" },
              { name: "Power", value: "87.5%", icon: <Zap className="h-4 w-4" />, color: "bg-amber-500" },
              { name: "Security", value: "100%", icon: <Shield className="h-4 w-4" />, color: "bg-indigo-500" },
            ].map((item, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-2 w-2 rounded-full ${item.color}`}></div>
                  {item.icon}
                </div>
                <div className="text-xs text-gray-400">{item.name}</div>
                <div className="text-lg font-medium text-white">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>System Load</span>
              <span>42%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
                style={{ width: "42%" }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div className="pt-4 border-t border-gray-800/70" variants={sectionVariants} custom={2}>
          <button className="w-full flex items-center justify-between bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg px-4 py-2.5 text-sm transition-colors duration-300">
            <span>View detailed analytics</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>

      {/* Highlight effect on edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              linear-gradient(to right, transparent, transparent 50%, rgba(99, 102, 241, 0.1) 50%, transparent),
              linear-gradient(to bottom, transparent, transparent 50%, rgba(99, 102, 241, 0.1) 50%, transparent)
            `,
            backgroundSize: "100% 1px, 1px 100%",
            backgroundPosition: "0 0, 0 0",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>

      {/* Subtle scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
          animation: "scanlines 8s linear infinite",
        }}
      ></div>
    </motion.div>
  )
}

