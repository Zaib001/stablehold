"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Trash2, Check, Plus, Save, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import EnigmaticSystem from "@/components/enigmatic-system"

// All existing background images
const existingBackgroundImages = [
  {
    id: 1,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_from_plane_window_of_raceh_6a46b45d-e56a-42ed-90ce-f8d452722ee9_2-ZJhTou5KopylyYm9XaYXjjrcaxC5xd.png",
    label: "Original Image 1 - Aerial view of racetrack",
    weight: 3,
    theme: "emerald",
    timeRestricted: false,
    active: true,
  },
  {
    id: 2,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_from_plane_window_of_raceh_e2d01690-6ea3-4bf2-bfa6-591f977e8bb8_2-WlWibIVRZ3FcTALYXRMWXg7KQNYy3X.png",
    label: "Original Image 2 - Aerial view of countryside",
    weight: 3,
    theme: "emerald",
    timeRestricted: false,
    active: true,
  },
  {
    id: 3,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_from_plane_window_of_raceh_5c59adaa-9e87-4c1b-8a07-2520c916e376_1-4uhCb5JxGTogJSElsaEuolSmcEY613.png",
    label: "New Image 1 - Racing Track with Motion Blur",
    weight: 1,
    theme: "emerald",
    timeRestricted: false,
    active: true,
  },
  {
    id: 4,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_at_night_from_plane_window_99702386-064b-4c15-895f-4cde59a59f56_1-ny22DM1Mel4OXwUcofpiZZZKeiyEco.png",
    label: "New Image 2 - Twilight Farm with White Fences",
    weight: 1,
    theme: "emerald",
    timeRestricted: false,
    active: true,
  },
  {
    id: 5,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_from_plane_window_of_raceh_2e81e26e-7ed7-427a-8f4a-bd9eb5fbfc25_1-uzmppyzehP7RyDqiw7Jtl26QqCXQfM.png",
    label: "New Image 3 - Night View of Countryside",
    weight: 3,
    theme: "emerald",
    timeRestricted: false,
    active: true,
  },
  {
    id: 6,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_at_night_from_plane_window_e6be4959-31ba-42c9-8a48-ddae27308dbc_0-XFkiHVxVWZr2apTK11zSm435mnrmhW.png",
    label: "New Image 4 - Night View of Racing Facility",
    weight: 3,
    theme: "emerald",
    timeRestricted: false,
    active: true,
  },
  {
    id: 7,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_at_sunset_orangish_from_of_13f02e30-e278-49be-8190-0ffb8d79d50f_3-1Ofb7IypLIkqvJ88LPMHW1SGYdbW7m.png",
    label: "Sunset Image - Orange/golden sunset view",
    weight: 4,
    theme: "sunset",
    timeRestricted: true,
    active: true,
  },
]

// New images to add (first batch)
const newBackgroundImages = [
  {
    id: 101,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_view_of_racehorse_track_at_luxury_race_24861c28-87e7-44fb-8338-aae5965244f9_2-WS8OJeRLTpj4BZQfnWhjUl49IlAUUd.png",
    label: "Racetrack at Golden Hour - Curved Track with Flowers",
    weight: 3,
    theme: "emerald",
    timeRestricted: false,
    active: false,
  },
  {
    id: 102,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_morning_dew_fog_of_racehorse_luxury_tr_c0efa08e-2c5d-4153-aae6-e9654ca03214_1-1Zl6PJ8u8SIRztcP22uhpMNKeT3sbE.png",
    label: "Misty Morning with Horses - Foggy Field with Pines",
    weight: 3,
    theme: "emerald",
    timeRestricted: false,
    active: false,
  },
  {
    id: 103,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_view_of_racehorse_training_track_at_lu_20f4bd00-484c-4ab5-830f-734309c8e031_0-4FownmHPRofcvGV10c5M6Lz6rQ9TJC.png",
    label: "Training Track at Sunset - Golden Light View",
    weight: 3,
    theme: "emerald",
    timeRestricted: false,
    active: false,
  },
  {
    id: 104,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_view_of_elevated_luxury_racehorse_stab_00b608c4-29d4-4880-ad04-f0d5f7e5b300_1-igxux7xeWeaESjZw1tE8C4fKCqugVA.png",
    label: "Horse Stables at Dusk - Evening Shadows",
    weight: 3,
    theme: "emerald",
    timeRestricted: false,
    active: false,
  },
]

// Additional new images (second batch)
const additionalBackgroundImages = [
  {
    id: 201,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_elevated_view_of_infield_racetrack_lou_8776d318-c28c-4e8a-9e7f-4b7960bb9e99_3-KmTMn8LS9wgYVsZV6taetZFBVyRlNh.png",
    label: "Luxury Lounge Terrace - Racetrack View with String Lights",
    weight: 3,
    theme: "sunset",
    timeRestricted: false,
    active: false,
  },
  {
    id: 202,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_view_of_racehorse_training_track_at_lu_d477d395-7092-4cdb-87f6-3230c33ed754_1-AwATtyjYwX1kTo8KlfLwXgf8KCkTym.png",
    label: "Twilight Training Track - Purple Dusk with Moon",
    weight: 3,
    theme: "emerald",
    timeRestricted: false,
    active: false,
  },
  {
    id: 203,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_elevated_view_of_infield_racetrack_lou_10c3a8e6-01b2-4474-92dc-d9e4cdc0eac1_3-wIcjCwDmzUseQ2yfKUPSIK9twgqkWw.png",
    label: "Trackside Dining Terrace - Evening View with Lights",
    weight: 3,
    theme: "sunset",
    timeRestricted: false,
    active: false,
  },
  {
    id: 204,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_elevated_view_of_infield_racetrack_lou_10c3a8e6-01b2-4474-92dc-d9e4cdc0eac1_1-byK9n09vj85gO1qCHYLt76QPsPcTEf.png",
    label: "Racetrack Lounge - Sunset View with String Lights",
    weight: 3,
    theme: "sunset",
    timeRestricted: false,
    active: false,
  },
  {
    id: 205,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_aerial_view_at_sunrise_orangish_from_o_ada9428e-03fe-428b-b14b-67059c9ed909_1-XGMwyKE8ISbywvCiGmETl3ehgDFFlt.png",
    label: "Aerial Sunrise View - Golden Light on Training Facility",
    weight: 4,
    theme: "sunset",
    timeRestricted: false,
    active: false,
  },
  {
    id: 206,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_elevated_view_of_infield_racetrack_lou_994dff46-afd8-47a2-8668-d981a6386300_0-EsNsxNpqAHehA3Q2ByqOly8Fw1s3CR.png",
    label: "Trackside Terrace - Evening Dining with Track View",
    weight: 3,
    theme: "sunset",
    timeRestricted: false,
    active: false,
  },
  {
    id: 207,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_sunrise_orangish_of_racehorse_stable_t_9ed43d1b-12aa-4662-a645-7f33e66ce611_0-FtrFMf84CREVAxlByFBW6ey3VYT4en.png",
    label: "Morning Training Track - Long Shadows with Eucalyptus Trees",
    weight: 3,
    theme: "emerald",
    timeRestricted: false,
    active: false,
  },
  {
    id: 208,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ting8921_photograph_of_view_of_elevated_luxury_racehorse_stab_8db2d894-b8a8-4c92-bf24-2edfaa98cd14_3-3wml4QsWmBHBsgb6qJUp4T2qYpFtSw.png",
    label: "Luxury Stables - Golden Hour with Tree Shadows",
    weight: 3,
    theme: "emerald",
    timeRestricted: false,
    active: false,
  },
]

export default function ViewBackgrounds() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTheme, setCurrentTheme] = useState("emerald")
  const [isSunsetTime, setIsSunsetTime] = useState(false)
  const [backgroundImages, setBackgroundImages] = useState([
    ...existingBackgroundImages,
    ...newBackgroundImages,
    ...additionalBackgroundImages,
  ])
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [showActionButtons, setShowActionButtons] = useState(false)
  const [message, setMessage] = useState("")
  const [isDesktop, setIsDesktop] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "active" | "new">("all")
  const [viewMode, setViewMode] = useState<"grid" | "full">("grid")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "emerald" | "sunset">("all")

  // Filter images based on active tab and category
  const filteredImages = backgroundImages.filter((img) => {
    // First filter by tab
    if (activeTab === "all") {
      // No tab filtering
    } else if (activeTab === "active" && !img.active) {
      return false
    } else if (activeTab === "new" && img.active) {
      return false
    }

    // Then filter by category
    if (categoryFilter === "all") {
      return true
    } else {
      return img.theme === categoryFilter
    }
  })

  // Function to check if current time is between 6pm-7pm EST
  const checkIfSunsetTime = (date: Date) => {
    // Convert to EST (UTC-5)
    const estOptions = { timeZone: "America/New_York" }
    const estTime = new Date(date.toLocaleString("en-US", estOptions))
    const hours = estTime.getHours()

    // Return true if time is between 6pm-7pm EST
    return hours === 18 // 6pm in 24-hour format
  }

  // Check if it's sunset time
  useEffect(() => {
    const now = new Date()
    const sunsetTime = checkIfSunsetTime(now)
    setIsSunsetTime(sunsetTime)
    setCurrentTheme(sunsetTime ? "sunset" : "emerald")
  }, [])

  // Detect if user is on desktop
  useEffect(() => {
    const userAgent = window.navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    setIsDesktop(!isMobile)
  }, [])

  // Fade-in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Toggle image selection
  const toggleImageSelection = (id: number) => {
    setSelectedImages((prev) => {
      if (prev.includes(id)) {
        return prev.filter((imageId) => imageId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Update action buttons visibility
  useEffect(() => {
    setShowActionButtons(selectedImages.length > 0)
  }, [selectedImages])

  // Add or remove selected images to active collection
  const handleAction = (action: "add" | "delete") => {
    const updatedImages = backgroundImages.map((image) => {
      if (selectedImages.includes(image.id)) {
        return {
          ...image,
          active: action === "add",
        }
      }
      return image
    })

    setBackgroundImages(updatedImages)
    setSelectedImages([])

    const actionText = action === "add" ? "added to" : "removed from"
    setMessage(`${selectedImages.length} image(s) ${actionText} your collection.`)

    // Auto-hide message after 5 seconds
    setTimeout(() => {
      setMessage("")
    }, 5000)
  }

  // Save changes and return to home
  const saveChanges = () => {
    setMessage("Changes saved! Redirecting to home...")

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/")
    }, 1500)
  }

  // Get theme class for buttons and UI elements
  const getThemeClass = (type: "bg" | "text" | "border" | "hover") => {
    if (currentTheme === "sunset") {
      switch (type) {
        case "bg":
          return "bg-amber-900/20"
        case "text":
          return "text-amber-400"
        case "border":
          return "border-amber-900/50"
        case "hover":
          return "hover:bg-amber-900/40"
      }
    } else {
      switch (type) {
        case "bg":
          return "bg-emerald-900/20"
        case "text":
          return "text-emerald-400"
        case "border":
          return "border-emerald-900/50"
        case "hover":
          return "hover:bg-emerald-900/40"
      }
    }
  }

  // Get active tab class
  const getTabClass = (tab: "all" | "active" | "new") => {
    return `px-4 py-2 text-xs font-medium rounded-md cursor-pointer transition-colors
      ${
        activeTab === tab
          ? `${getThemeClass("bg")} ${getThemeClass("text")}`
          : `bg-black/50 ${currentTheme === "sunset" ? "text-amber-500/60" : "text-emerald-500/60"} ${getThemeClass("hover")}`
      }`
  }

  // Get category filter class
  const getCategoryClass = (category: "all" | "emerald" | "sunset") => {
    return `px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-colors
      ${
        categoryFilter === category
          ? `${getThemeClass("bg")} ${getThemeClass("text")}`
          : `bg-black/50 ${currentTheme === "sunset" ? "text-amber-500/60" : "text-emerald-500/60"} ${getThemeClass("hover")}`
      }`
  }

  return (
    <main
      className={`min-h-screen bg-black p-4 sm:p-8 overflow-auto ${currentTheme === "sunset" ? "theme-sunset" : ""}`}
    >
      <div className="max-w-7xl mx-auto mb-8">
        {/* Header with navigation and action buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <Link
            href="/"
            className={`flex items-center gap-1 text-xs ${currentTheme === "sunset" ? "text-amber-500/70 hover:text-amber-400" : "text-emerald-500/70 hover:text-emerald-400"} transition-colors p-1 w-fit`}
          >
            <ArrowLeft className="h-3 w-3" />
            <span>RETURN TO HOME</span>
          </Link>

          <div className="flex flex-wrap gap-2">
            {/* View mode toggle */}
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "full" : "grid")}
              className={`flex items-center gap-1 text-xs ${getThemeClass("bg")} ${getThemeClass("text")} transition-colors p-2 rounded-md`}
            >
              <Eye className="h-3 w-3" />
              <span>{viewMode === "grid" ? "FULL VIEW" : "GRID VIEW"}</span>
            </button>

            {/* Action buttons */}
            {showActionButtons && (
              <>
                {/* Show Add button for images not in collection */}
                {selectedImages.some((id) => !backgroundImages.find((img) => img.id === id)?.active) && (
                  <button
                    className={`flex items-center gap-1 text-xs ${getThemeClass("bg")} ${getThemeClass("text")} transition-colors p-2 rounded-md`}
                    onClick={() => handleAction("add")}
                  >
                    <Plus className="h-3 w-3" />
                    <span>ADD SELECTED</span>
                  </button>
                )}

                {/* Show Delete button for images in collection */}
                {selectedImages.some((id) => backgroundImages.find((img) => img.id === id)?.active) && (
                  <button
                    className={`flex items-center gap-1 text-xs ${getThemeClass("bg")} ${getThemeClass("text")} transition-colors p-2 rounded-md`}
                    onClick={() => handleAction("delete")}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>REMOVE SELECTED</span>
                  </button>
                )}
              </>
            )}

            <button
              className={`flex items-center gap-1 text-xs ${getThemeClass("bg")} ${getThemeClass("text")} transition-colors p-2 rounded-md`}
              onClick={saveChanges}
            >
              <Save className="h-3 w-3" />
              <span>SAVE CHANGES</span>
            </button>
          </div>
        </div>

        <h1
          className={`${currentTheme === "sunset" ? "text-amber-500" : "text-emerald-500"} text-xl mt-4 mb-2 font-mono`}
        >
          BACKGROUND MANAGER
        </h1>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <div onClick={() => setActiveTab("all")} className={getTabClass("all")}>
            ALL BACKGROUNDS
          </div>
          <div onClick={() => setActiveTab("active")} className={getTabClass("active")}>
            ACTIVE ({backgroundImages.filter((img) => img.active).length})
          </div>
          <div onClick={() => setActiveTab("new")} className={getTabClass("new")}>
            NEW ADDITIONS ({backgroundImages.filter((img) => !img.active).length})
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <div onClick={() => setCategoryFilter("all")} className={getCategoryClass("all")}>
            ALL THEMES
          </div>
          <div onClick={() => setCategoryFilter("emerald")} className={getCategoryClass("emerald")}>
            EMERALD THEME
          </div>
          <div onClick={() => setCategoryFilter("sunset")} className={getCategoryClass("sunset")}>
            SUNSET THEME
          </div>
        </div>

        {message && (
          <div
            className={`${currentTheme === "sunset" ? "bg-amber-900/20 text-amber-400" : "bg-emerald-900/20 text-emerald-400"} p-2 rounded-md text-xs mb-4`}
          >
            {message}
          </div>
        )}

        {/* Background images grid */}
        <div
          className={`grid grid-cols-1 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""} gap-8 transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {filteredImages.map((image) => {
            // Determine theme for this specific background
            const imageTheme = image.theme || "emerald"

            return (
              <div
                key={image.id}
                className={`relative flex flex-col space-y-2 cursor-pointer transition-all duration-200 ${
                  selectedImages.includes(image.id)
                    ? `${imageTheme === "sunset" ? "ring-2 ring-amber-500" : "ring-2 ring-emerald-500"} rounded-lg scale-[0.98]`
                    : "hover:scale-[0.99]"
                }`}
                onClick={() => toggleImageSelection(image.id)}
              >
                {/* Status indicator (active/new) */}
                <div className="absolute top-2 left-2 z-10">
                  <div
                    className={`text-xs px-2 py-1 rounded-md ${
                      image.active
                        ? `${imageTheme === "sunset" ? "bg-amber-500/70" : "bg-emerald-500/70"} text-black`
                        : "bg-gray-800/80 text-white"
                    }`}
                  >
                    {image.active ? "ACTIVE" : "NEW"}
                  </div>
                </div>

                {/* Theme indicator */}
                <div className="absolute top-2 right-16 z-10">
                  <div
                    className={`text-xs px-2 py-1 rounded-md ${
                      imageTheme === "sunset" ? "bg-amber-500/40 text-white" : "bg-emerald-500/40 text-white"
                    }`}
                  >
                    {imageTheme.toUpperCase()}
                  </div>
                </div>

                {/* Background preview with widget */}
                <div
                  className={`relative ${viewMode === "full" ? "min-h-[500px]" : "aspect-video"} overflow-hidden rounded-lg border ${getThemeClass("border")}`}
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${image.url})`,
                      filter:
                        imageTheme === "sunset" ? "brightness(0.5) saturate(0.9)" : "brightness(0.6) saturate(0.8)",
                    }}
                  />

                  {/* Overlay - improved gradient for better visibility with darker bottom */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent"
                    style={{ backdropFilter: "blur(0.5px)" }}
                  />

                  {/* Widget centered on background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-full ${viewMode === "full" ? "max-w-sm" : "max-w-[200px] sm:max-w-[250px]"}`}>
                      <EnigmaticSystem isDesktop={isDesktop} theme={imageTheme} />
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {selectedImages.includes(image.id) && (
                    <div
                      className={`absolute top-2 right-2 ${
                        imageTheme === "sunset" ? "bg-amber-500" : "bg-emerald-500"
                      } rounded-full p-2 z-10`}
                    >
                      <Check className="h-4 w-4 text-black" />
                    </div>
                  )}
                </div>

                {/* Image details */}
                <div
                  className={`${imageTheme === "sunset" ? "text-amber-500" : "text-emerald-500"} text-xs font-mono p-2 bg-black/80 rounded-lg`}
                >
                  <p className="mb-1 font-bold">{image.label}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`${imageTheme === "sunset" ? "text-amber-400/70" : "text-emerald-400/70"}`}>
                      Weight: {image.weight}
                    </span>
                    <span className={`${imageTheme === "sunset" ? "text-amber-400/70" : "text-emerald-400/70"}`}>
                      Theme: {image.theme}
                    </span>
                    {image.timeRestricted && (
                      <span className={`${imageTheme === "sunset" ? "text-amber-300" : "text-emerald-300"}`}>
                        Time: 6-7pm EST
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

