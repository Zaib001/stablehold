"use client"

import { useState, useEffect } from "react"
import EnigmaticSystem from "@/components/enigmatic-system"
import Link from "next/link"

// Categorize background images by time of day
// Morning images (5am-11am EST)
const morningBackgroundImages = [
  {
    id: 102,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_morning_dew_fog_of_racehorse_luxury_tr_c0efa08e-2c5d-4153-aae6-e9654ca03214_1-1Zl6PJ8u8SIRztcP22uhpMNKeT3sbE.png", // Morning dew fog
    weight: 4,
  },
  {
    id: 207,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_sunrise_orangish_of_racehorse_stable_t_9ed43d1b-12aa-4662-a645-7f33e66ce611_0-FtrFMf84CREVAxlByFBW6ey3VYT4en.png", // Morning Training Track with long shadows
    weight: 4,
  },
  {
    id: 208,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_view_of_elevated_luxury_racehorse_stab_8db2d894-b8a8-4c92-bf24-2edfaa98cd14_3-3wml4QsWmBHBsgb6qJUp4T2qYpFtSw.png", // Luxury Stables with golden hour light
    weight: 3,
  },
  {
    id: 205,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_at_sunrise_orangish_from_o_ada9428e-03fe-428b-b14b-67059c9ed909_1-XGMwyKE8ISbywvCiGmETl3ehgDFFlt.png", // Aerial Sunrise View
    weight: 4,
  },
]

// Daytime images (11am-5pm EST)
const daytimeBackgroundImages = [
  {
    id: 1,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_from_plane_window_of_raceh_6a46b45d-e56a-42ed-90ce-f8d452722ee9_2-ZJhTou5KopylyYm9XaYXjjrcaxC5xd.png", // Original bright daytime image
    weight: 3,
  },
  {
    id: 3,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_from_plane_window_of_raceh_5c59adaa-9e87-4c1b-8a07-2520c916e376_1-4uhCb5JxGTogJSElsaEuolSmcEY613.png", // Bright racetrack with motion blur
    weight: 3,
  },
  {
    id: 101,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_view_of_racehorse_track_at_luxury_race_24861c28-87e7-44fb-8338-aae5965244f9_2-WS8OJeRLTpj4BZQfnWhjUl49IlAUUd.png", // Racetrack with flowers in daylight
    weight: 4,
  },
  {
    id: 103,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_view_of_racehorse_training_track_at_lu_20f4bd00-484c-4ab5-830f-734309c8e031_0-4FownmHPRofcvGV10c5M6Lz6rQ9TJC.png", // Training track in bright daylight
    weight: 3,
  },
  {
    id: 104,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_view_of_elevated_luxury_racehorse_stab_00b608c4-29d4-4880-ad04-f0d5f7e5b300_1-igxux7xeWeaESjZw1tE8C4fKCqugVA.png", // Horse stables in daylight
    weight: 3,
  },
]

// Sunset images (6pm-7pm EST) - keeping this the same as requested
const sunsetBackgroundImages = [
  {
    id: 7,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_at_sunset_orangish_from_of_13f02e30-e278-49be-8190-0ffb8d79d50f_3-1Ofb7IypLIkqvJ88LPMHW1SGYdbW7m.png", // Original sunset image
    weight: 4,
  },
  {
    id: 201,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_elevated_view_of_infield_racetrack_lou_8776d318-c28c-4e8a-9e7f-4b7960bb9e99_3-KmTMn8LS9wgYVsZV6taetZFBVyRlNh.png", // Luxury Lounge Terrace at sunset
    weight: 3,
  },
  {
    id: 203,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_elevated_view_of_infield_racetrack_lou_10c3a8e6-01b2-4474-92dc-d9e4cdc0eac1_3-wIcjCwDmzUseQ2yfKUPSIK9twgqkWw.png", // Trackside Dining Terrace at sunset
    weight: 3,
  },
  {
    id: 204,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_elevated_view_of_infield_racetrack_lou_10c3a8e6-01b2-4474-92dc-d9e4cdc0eac1_1-byK9n09vj85gO1qCHYLt76QPsPcTEf.png", // Racetrack Lounge at sunset
    weight: 3,
  },
  {
    id: 206,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_elevated_view_of_infield_racetrack_lou_994dff46-afd8-47a2-8668-d981a6386300_0-EsNsxNpqAHehA3Q2ByqOly8Fw1s3CR.png", // Trackside Terrace at sunset
    weight: 3,
  },
]

// Night images (7pm-5am EST)
const nightBackgroundImages = [
  {
    id: 4,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_at_night_from_plane_window_99702386-064b-4c15-895f-4cde59a59f56_1-ny22DM1Mel4OXwUcofpiZZZKeiyEco.png", // Twilight farm with white fences
    weight: 5, // Increased weight
  },
  {
    id: 5,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_from_plane_window_of_raceh_2e81e26e-7ed7-427a-8f4a-bd9eb5fbfc25_1-uzmppyzehP7RyDqiw7Jtl26QqCXQfM.png", // Night view of countryside
    weight: 5, // Increased weight
  },
  {
    id: 6,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_at_night_from_plane_window_e6be4959-31ba-42c9-8a48-ddae27308dbc_0-XFkiHVxVWZr2apTK11zSm435mnrmhW.png", // Night view of racing facility
    weight: 5, // Increased weight
  },
  {
    id: 202,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_view_of_racehorse_training_track_at_lu_d477d395-7092-4cdb-87f6-3230c33ed754_1-AwATtyjYwX1kTo8KlfLwXgf8KCkTym.png", // Twilight Training Track with purple dusk
    weight: 4,
  },
]

// Time period types
type TimePeriod = "morning" | "day" | "sunset" | "night"

export default function Home() {
  const [showHiddenText, setShowHiddenText] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showWidget, setShowWidget] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState("")
  const [currentTheme, setCurrentTheme] = useState("emerald")
  const [revelationTapCount, setRevelationTapCount] = useState(0)
  const [showRevelationLink, setShowRevelationLink] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentTimePeriod, setCurrentTimePeriod] = useState<TimePeriod>("day")

  // Force a specific time period for testing (comment out in production)
  // useEffect(() => {
  //   setCurrentTimePeriod("night")
  // }, [])

  // Function to determine the current time period based on Eastern Time
  const determineTimePeriod = (date: Date): TimePeriod => {
    // Convert to EST (UTC-5)
    const estOptions = { timeZone: "America/New_York" }
    const estTimeStr = date.toLocaleString("en-US", estOptions)
    const estTime = new Date(estTimeStr)
    const hours = estTime.getHours()

    console.log(`Current EST time: ${estTimeStr}, Hour: ${hours}`)

    // Determine time period based on hour
    if (hours >= 5 && hours < 11) {
      return "morning" // 5am-11am: Morning
    } else if (hours >= 11 && hours < 18) {
      return "day" // 11am-6pm: Day
    } else if (hours === 18) {
      return "sunset" // 6pm-7pm: Sunset (specifically 6pm hour)
    } else {
      return "night" // 7pm-5am: Night (including 4am)
    }
  }

  // Update current time and time period every minute
  useEffect(() => {
    // Only check the time period once when the component mounts
    const now = new Date()
    const period = determineTimePeriod(now)
    setCurrentTimePeriod(period)
    console.log(`Current time period: ${period} at ${now.toLocaleString("en-US", { timeZone: "America/New_York" })}`)
  }, [])

  // Select background based on time period
  useEffect(() => {
    let selectedBackgroundImages
    let selectedTheme = "emerald"

    // Select the appropriate image set based on time period
    switch (currentTimePeriod) {
      case "morning":
        selectedBackgroundImages = morningBackgroundImages
        break
      case "day":
        selectedBackgroundImages = daytimeBackgroundImages
        break
      case "sunset":
        selectedBackgroundImages = sunsetBackgroundImages
        selectedTheme = "sunset"
        break
      case "night":
        selectedBackgroundImages = nightBackgroundImages
        break
      default:
        selectedBackgroundImages = daytimeBackgroundImages
    }

    // Create weighted array and select random image
    const weightedArray = selectedBackgroundImages.flatMap((img) => Array(img.weight).fill(img.url))
    const randomIndex = Math.floor(Math.random() * weightedArray.length)
    const selectedImage = weightedArray[randomIndex]

    // Set the background image and theme
    setBackgroundImage(selectedImage)
    setCurrentTheme(selectedTheme)

    // Store the selected image and time period in localStorage for consistency across pages
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedBackgroundImage", selectedImage)
      localStorage.setItem("currentTimePeriod", currentTimePeriod)
      localStorage.setItem("currentTheme", selectedTheme)
    }
    console.log(`Current time period: ${currentTimePeriod}`)
  }, [currentTimePeriod])

  // Check for stored background from previous session
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const storedBackground = localStorage.getItem("selectedBackgroundImage")
      const storedTimePeriod = localStorage.getItem("currentTimePeriod") as TimePeriod | null
      const storedTheme = localStorage.getItem("currentTheme")

      // If we have stored values and no background set yet
      if (storedBackground && !backgroundImage) {
        setBackgroundImage(storedBackground)

        // Also restore the theme if available
        if (storedTheme) {
          setCurrentTheme(storedTheme)
        }

        // Update time period if available
        if (storedTimePeriod) {
          setCurrentTimePeriod(storedTimePeriod)
        }
      }
    }
  }, [backgroundImage])

  // Detect if user is on desktop
  useEffect(() => {
    const userAgent = window.navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    setIsDesktop(!isMobile)
  }, [])

  // Show hidden text after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHiddenText(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Fade in background immediately
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Show widget after a delay with a smoother transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWidget(true)
    }, 1800) // Slightly earlier start to account for longer transition

    return () => clearTimeout(timer)
  }, [])

  // Revelation link logic - show after 3 taps in top-right corner
  useEffect(() => {
    if (revelationTapCount >= 3) {
      setShowRevelationLink(true)
      // Auto-hide after 5 seconds for better UX
      const timer = setTimeout(() => {
        setShowRevelationLink(false)
        setRevelationTapCount(0)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [revelationTapCount])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className={`fixed inset-0 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: currentTheme === "sunset" ? "brightness(0.5) saturate(0.9)" : "brightness(0.6) saturate(0.8)",
          }}
        />
        {/* Overlay - improved gradient for better visibility with darker bottom */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent"
          style={{ backdropFilter: "blur(0.5px)" }}
        />
      </div>

      {/* Hidden touch area in top-right corner for Revelation page */}
      <div className="fixed top-0 right-0 w-16 h-16 z-20" onClick={() => setRevelationTapCount((prev) => prev + 1)}>
        {/* Show counter hint if taps have started but not enough yet */}
        {!showRevelationLink && revelationTapCount > 0 && (
          <div className="absolute top-4 right-4 text-[10px] text-emerald-500/30">
            {3 - revelationTapCount > 0 ? `${3 - revelationTapCount} more` : ""}
          </div>
        )}

        {/* Show revelation link when enough taps */}
        {showRevelationLink && (
          <Link
            href="/revelation"
            className="absolute top-4 right-4 bg-black border border-emerald-900/50 rounded-md p-2 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Revelation access"
          >
            <span className={`text-xs ${currentTheme === "sunset" ? "text-amber-400" : "text-emerald-400"}`}>
              REVELATION
            </span>
          </Link>
        )}
      </div>

      {/* Hidden touch area for Success page (original) */}
      <div className="fixed top-0 right-0 w-16 h-16 z-10">
        <Link href="/success" className="w-full h-full block opacity-0" aria-hidden="true" />
      </div>

      {/* Hidden racehorse emoji in top-left - only visible on desktop */}
      {isDesktop && (
        <Link
          href="/prediction"
          className={`absolute top-3 left-3 sm:top-4 sm:left-4 text-base sm:text-lg opacity-0 transition-opacity duration-1000 ${showHiddenText ? "opacity-15" : ""} hover:opacity-30 z-10`}
        >
          🏇
        </Link>
      )}

      {/* Widget container with proper centering for all devices */}
      <div className="w-full max-w-screen-lg mx-auto flex items-center justify-center relative z-10">
        <div
          className={`transition-opacity duration-2000 ease-in ${
            showWidget ? "opacity-100" : "opacity-0"
          } ${isDesktop ? "w-full max-w-sm" : "w-[85%] max-w-[350px] transform scale-90"}`}
        >
          <EnigmaticSystem isDesktop={isDesktop} theme={currentTheme} />
        </div>
      </div>

      {/* Barely visible text link with fade-in effect */}
      <a
        href="https://x.com/stablehold"
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[8px] xs:text-[9px] sm:text-xs font-mono ${currentTheme === "sunset" ? "text-amber-900/30 hover:text-amber-500/50" : "text-emerald-900/30 hover:text-emerald-500/50"} transition-colors duration-300 opacity-0 transition-opacity duration-1000 z-10 ${showHiddenText ? "opacity-100" : ""}`}
      >
        When is Stablehold dropping?
      </a>
    </main>
  )
}

