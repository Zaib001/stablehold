"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// Background images with weights - same as homepage
// Higher weight = higher probability of selection
const backgroundImages = [
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_from_plane_window_of_raceh_6a46b45d-e56a-42ed-90ce-f8d452722ee9_2-ZJhTou5KopylyYm9XaYXjjrcaxC5xd.png",
    weight: 3, // Original Image 1 - higher weight
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_from_plane_window_of_raceh_e2d01690-6ea3-4bf2-bfa6-591f977e8bb8_2-WlWibIVRZ3FcTALYXRMWXg7KQNYy3X.png",
    weight: 3, // Original Image 2 - higher weight
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_from_plane_window_of_raceh_5c59adaa-9e87-4c1b-8a07-2520c916e376_1-4uhCb5JxGTogJSElsaEuolSmcEY613.png",
    weight: 1, // New Image 1 - lower weight as requested
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_at_night_from_plane_window_99702386-064b-4c15-895f-4cde59a59f56_1-ny22DM1Mel4OXwUcofpiZZZKeiyEco.png",
    weight: 1, // New Image 2 - lower weight as requested
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_from_plane_window_of_raceh_2e81e26e-7ed7-427a-8f4a-bd9eb5fbfc25_1-uzmppyzehP7RyDqiw7Jtl26QqCXQfM.png",
    weight: 3, // New Image 3 - higher weight
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_at_night_from_plane_window_e6be4959-31ba-42c9-8a48-ddae27308dbc_0-XFkiHVxVWZr2apTK11zSm435mnrmhW.png",
    weight: 3, // New Image 4 - higher weight
  },
]

export default function PredictionPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState("")
  const router = useRouter()

  // Select random background on mount using weighted selection - same as homepage
  useEffect(() => {
    // Create weighted array where images with higher weights appear multiple times
    const weightedArray = backgroundImages.flatMap((img) => Array(img.weight).fill(img.url))

    // Select random image from weighted array
    const randomIndex = Math.floor(Math.random() * weightedArray.length)
    setBackgroundImage(weightedArray[randomIndex])
  }, [])

  // Check if user is on desktop
  useEffect(() => {
    const userAgent = window.navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    setIsDesktop(!isMobile)

    // Redirect mobile users back to homepage
    if (isMobile) {
      router.push("/")
    }
  }, [router])

  // Fade-in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // If not desktop, don't render the content
  if (!isDesktop) {
    return null
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 overflow-hidden flex-center">
      {/* Background image with overlay - same as homepage */}
      <div className={`fixed inset-0 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: "brightness(0.6) saturate(0.8)",
          }}
        />
        {/* Overlay - improved gradient for better visibility with darker bottom */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent"
          style={{ backdropFilter: "blur(0.5px)" }}
        />
      </div>

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1 text-xs text-emerald-500/70 hover:text-emerald-400 transition-colors p-1 z-10"
      >
        <ArrowLeft className="h-3 w-3" />
        <span>RETURN</span>
      </Link>

      <div
        className={`w-full max-w-md mx-auto flex flex-col items-center justify-center transition-all duration-1000 relative z-10 widget-container ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Main message */}
        <div className="text-center space-y-4">
          <div className="text-emerald-500/80 font-mono text-sm xs:text-base sm:text-lg tracking-wider">
            We will win the Kentucky Derby, remember this.
          </div>

          <div className="text-emerald-900/40 font-mono text-[10px] xs:text-xs tracking-wide mt-8">
            TIMESTAMP: {new Date().toISOString()}
          </div>
        </div>
      </div>
    </main>
  )
}

