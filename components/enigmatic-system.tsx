"use client";
import { useEffect, useState, useRef } from "react";
import {
  Cloud,
  Thermometer,
  Wind,
  Loader2,
  Send,
  Droplets,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { submitEmail } from "@/app/actions/email-actions";
// Import useRouter at the top of the file
import { useRouter } from "next/navigation";

// Update the WeatherData interface to match the free API data structure
interface WeatherData {
  temp: number;
  windSpeed: number;
  humidity: number;
  pressure: number;
  description?: string;
  icon?: string;
  cityName?: string;
  timestamp?: string;
  feelsLike?: number;
}

interface EnigmaticSystemProps {
  isDesktop?: boolean;
  theme?: string;
}

export default function EnigmaticSystem({
  isDesktop = false,
  theme = "emerald",
}: EnigmaticSystemProps) {
  // Add the useRouter hook inside the component
  const router = useRouter();
  // Calculate current progress based on days elapsed
  const calculateCurrentProgress = () => {
    // Define the fixed start date (March 7, 2025, at midnight EST)
    const startDate = new Date(Date.UTC(2025, 2, 7, 5, 0, 0)); // EST = UTC-5 (March = 2 in JS)

    // Get the current date in UTC
    const nowUtc = new Date();

    // Convert UTC time to EST by subtracting 5 hours
    const nowEst = new Date(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth(), nowUtc.getUTCDate());

    // Calculate days elapsed since start date
    const daysElapsed = Math.floor(
      (nowEst.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Base progress (20%) + days elapsed (1% per day)
    const calculatedProgress = 20 + daysElapsed;

    // Cap at 100%
    return Math.min(calculatedProgress, 100);
};


  // Update the fallback weather data to match Lexington's typical values
  const fallbackWeatherData: WeatherData = {
    temp: 68.5, // Typical spring temperature for Lexington
    windSpeed: 7.2, // Average wind speed
    humidity: 65, // Average humidity
    pressure: 1015,
    description: "Partly cloudy",
    cityName: "Lexington",
    timestamp: new Date().toISOString(),
    feelsLike: 70.2,
  };

  const [progress, setProgress] = useState(0);
  const [pulseOpacity, setPulseOpacity] = useState(0.5);
  const [currentTimestamp, setCurrentTimestamp] = useState(
    Math.floor(Date.now() / 1000)
  );
  const [weatherData, setWeatherData] =
    useState<WeatherData>(fallbackWeatherData);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [secretTapCount, setSecretTapCount] = useState(0);
  const [showSecretButton, setShowSecretButton] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [progressBarActive, setProgressBarActive] = useState(false);
  const animationRef = useRef<number | null>(null);
  const [percentText] = useState("PERCENT"); // Only shows "PERCENT" now
  const [textOpacity, setTextOpacity] = useState(1); // For text fade effect
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [animationDirection, setAnimationDirection] = useState<
    "increasing" | "decreasing"
  >("increasing");
  const [textAnimationStarted, setTextAnimationStarted] = useState(false);
  const [apiAttempts, setApiAttempts] = useState(0);

  // Current progress value (calculated based on days elapsed)
  const currentValue = calculateCurrentProgress();
  // Total progress value (100%)
  const totalValue = 100;
  // Daily increment (1%)
  const dailyIncrement = 1;

  // Loading phase labels - updated to replace "LOADING" with "SHIPPING"
  const phaseLabels = ["INITIALIZING", "VERIFYING", "SHIPPING"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      localStorage.setItem("user_email", email); // Store email temporarily

      // Redirect to success page
      router.push("/success");
    } catch (error) {
      console.error("Error submitting email:", error);
    }
  };
  // Fetch real weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setIsWeatherLoading(true);

        // Only attempt API call once, then use fallback data
        if (apiAttempts >= 1) {
          console.log("Using fallback weather data after failed API attempt");
          setWeatherData(fallbackWeatherData);
          setWeatherError("Using fallback data");
          setIsWeatherLoading(false);
          return;
        }

        // Add a cache-busting query parameter to ensure we get fresh data
        const response = await fetch(`/api/weather?t=${Date.now()}`);
        setApiAttempts((prev) => prev + 1);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `API responded with status: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        console.log("Weather data received:", data);

        // Validate the data has the expected structure
        if (data.temp === undefined) {
          console.error("Invalid temperature data received:", data);
          throw new Error("Invalid temperature data received");
        }

        setWeatherData({
          temp: Number.parseFloat(data.temp.toFixed(1)),
          windSpeed: Number.parseFloat(data.windSpeed.toFixed(1)),
          humidity: data.humidity,
          pressure: data.pressure,
          description: data.description,
          icon: data.icon,
          cityName: data.cityName,
          timestamp: data.timestamp,
          feelsLike: data.feelsLike,
        });
        setWeatherError(null);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setWeatherError(
          error instanceof Error ? error.message : "Unknown error"
        );
        // Use fallback data on error
        setWeatherData(fallbackWeatherData);
      } finally {
        setIsWeatherLoading(false);
      }
    };

    // Fetch weather data immediately
    fetchWeatherData();

    // Don't set up interval if we're using fallback data
    if (apiAttempts === 0) {
      // Then fetch every 5 minutes for more frequent updates
      const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [apiAttempts]);

  // Get theme-specific color classes
  const getThemeClasses = () => {
    if (theme === "sunset") {
      return {
        textPrimary: "text-amber-500",
        textSecondary: "text-amber-500/70",
        textAccent: "text-amber-400",
        textMuted: "text-amber-500/60",
        borderColor: "border-amber-900/50",
        borderMuted: "border-amber-900/30",
        bgPrimary: "bg-amber-500",
        bgSecondary: "bg-amber-900/20",
        bgMuted: "bg-amber-900/30",
        pulseColor: "bg-amber-500/10",
        hoverColor: "hover:text-amber-400",
        buttonBg: "bg-amber-900/50 hover:bg-amber-800/50",
        buttonText: "text-amber-400",
        progressBg: "bg-amber-900/30",
        progressFill: "bg-amber-500",
        themeClass: "theme-sunset",
      };
    }

    // Default emerald theme
    return {
      textPrimary: "text-emerald-500",
      textSecondary: "text-emerald-500/70",
      textAccent: "text-emerald-400",
      textMuted: "text-emerald-500/60",
      borderColor: "border-emerald-900/50",
      borderMuted: "border-emerald-900/30",
      bgPrimary: "bg-emerald-500",
      bgSecondary: "bg-emerald-900/20",
      bgMuted: "bg-emerald-900/30",
      pulseColor: "bg-emerald-500/10",
      hoverColor: "hover:text-emerald-400",
      buttonBg: "bg-emerald-900/50 hover:bg-emerald-800/50",
      buttonText: "text-emerald-400",
      progressBg: "bg-emerald-900/30",
      progressFill: "bg-emerald-500",
      themeClass: "",
    };
  };

  const themeClasses = getThemeClasses();

  // Fade-in animation on mount with staged approach
  useEffect(() => {
    // Stage 1: Initial appearance - more gradual
    const stageOneTimer = setTimeout(() => {
      setAnimationStage(1);
    }, 200); // Reduced from 300ms for quicker initial appearance

    // Stage 2: Clarity enhancement - more time between stages
    const stageTwoTimer = setTimeout(() => {
      setAnimationStage(2);
    }, 1200); // Reduced from 1800ms for a more fluid transition

    // Stage 3: Full clarity - more time to complete
    const stageThreeTimer = setTimeout(() => {
      setAnimationStage(3);
      setIsLoaded(true);
    }, 2200); // Reduced from 3000ms for a quicker overall animation

    return () => {
      clearTimeout(stageOneTimer);
      clearTimeout(stageTwoTimer);
      clearTimeout(stageThreeTimer);
    };
  }, []);

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(currentValue);
    }, 3200); // Delayed to allow fade-in to complete (increased from 2200ms)

    return () => clearTimeout(timer);
  }, [currentValue]);

  // One-time background opacity rise instead of continuous pulse
  useEffect(() => {
    // Start with lower opacity
    setPulseOpacity(0.3);

    // After a delay, increase to final opacity and stay there
    const timer = setTimeout(() => {
      setPulseOpacity(0.8);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Update timestamp
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Start text animation with a 4-second delay after loading
  useEffect(() => {
    if (!isLoaded) return;

    // Delay the start of the animation to ensure everything is rendered
    const startDelay = setTimeout(() => {
      setTextAnimationStarted(true);
    }, 4000); // 4 second delay after isLoaded becomes true

    return () => clearTimeout(startDelay);
  }, [isLoaded]);

  // Smooth Apple-like loading animation
  useEffect(() => {
    // Phase rotation - updated to cycle through the new 3 phases
    const phaseInterval = setInterval(() => {
      setLoadingPhase((prev) => (prev + 1) % 3); // Changed from % 4 to % 3 for three phases
    }, 3000);

    // Function to animate the loading bar with smooth bidirectional motion
    const startSmoothAnimation = () => {
      setProgressBarActive(true);
      let startTime: number | null = null;
      let lastTimestamp = 0;

      // Animation constants
      const increaseDuration = 8000; // 8 seconds to increase
      const decreaseDuration = 6000; // 6 seconds to decrease
      const holdDuration = 1000; // 1 second to hold at peak

      // Animation function
      const animate = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp;
          lastTimestamp = timestamp;
        }

        const elapsed = timestamp - startTime;
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        // Determine which phase of animation we're in
        if (animationDirection === "increasing") {
          // Increasing phase (0% to currentValue%)
          const progress = Math.min(elapsed / increaseDuration, 1);
          const easedProgress = easeInOutSine(progress);
          const newValue = Math.floor(easedProgress * currentValue);

          setLoadingProgress(newValue);

          // Check if we've reached the peak
          if (progress >= 1) {
            // Hold at peak for a moment before decreasing
            setTimeout(() => {
              setAnimationDirection("decreasing");
              startTime = null; // Reset start time for decreasing phase
            }, holdDuration);
          }
        } else {
          // Decreasing phase (currentValue% to 0%)
          const progress = Math.min(elapsed / decreaseDuration, 1);
          const easedProgress = easeInOutSine(progress);
          const newValue = Math.floor((1 - easedProgress) * currentValue);

          setLoadingProgress(newValue);

          // Check if we've reached zero
          if (progress >= 1) {
            // Reset to increasing phase
            setAnimationDirection("increasing");
            startTime = null; // Reset start time for increasing phase
          }
        }

        // Continue animation
        animationRef.current = requestAnimationFrame(animate);
      };

      // Start the animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start the animation after component mounts
    const startTimer = setTimeout(() => {
      startSmoothAnimation();
    }, 3500); // Start after the main UI has faded in

    return () => {
      clearInterval(phaseInterval);
      clearTimeout(startTimer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentValue, animationDirection]);

  // Smooth sine easing function for fluid motion
  const easeInOutSine = (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  };

  // Secret button reveal logic
  useEffect(() => {
    if (secretTapCount >= 3) {
      setShowSecretButton(true);
      // Auto-hide after 5 seconds for better UX
      const timer = setTimeout(() => {
        setShowSecretButton(false);
        setSecretTapCount(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [secretTapCount]);

  // Animation styles based on stage
  const getAnimationStyles = () => {
    // Base styles that never change
    const baseStyles = {
      maxHeight: "100vh",
      overflowY: "auto",
    };

    // Stage-specific styles with more gradual progression
    switch (animationStage) {
      case 0:
        return {
          ...baseStyles,
          opacity: 0,
          filter: "blur(8px)",
          transform: "scale(0.96)",
        };
      case 1:
        return {
          ...baseStyles,
          opacity: 0.4,
          filter: "blur(4px)",
          transform: "scale(0.98)",
        };
      case 2:
        return {
          ...baseStyles,
          opacity: 0.7,
          filter: "blur(2px)",
          transform: "scale(0.99)",
        };
      case 3:
        return {
          ...baseStyles,
          opacity: 1,
          filter: "blur(0px)",
          transform: "scale(1)",
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div
      className={`w-full mx-auto bg-black ${themeClasses.textPrimary} ${
        isDesktop ? "p-4 sm:p-5" : "p-3"
      } rounded-xl border ${themeClasses.borderColor} shadow-lg font-mono ${
        themeClasses.themeClass
      }`}
      style={{
        ...getAnimationStyles(),
        transition:
          "opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1), filter 1.7s cubic-bezier(0.22, 1, 0.36, 1), transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Add a subtle scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 rounded-xl overflow-hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
          animation: "scanlines 8s linear infinite",
          zIndex: 1,
        }}
      ></div>

      {/* Highlight effect on edges */}
      <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              theme === "sunset"
                ? `
      linear-gradient(to right, transparent, transparent 50%, rgba(251, 191, 36, 0.1) 50%, transparent),
      linear-gradient(to bottom, transparent, transparent 50%, rgba(251, 191, 36, 0.1) 50%, transparent)
    `
                : `
      linear-gradient(to right, transparent, transparent 50%, rgba(16, 185, 129, 0.1) 50%, transparent),
      linear-gradient(to bottom, transparent, transparent 50%, rgba(16, 185, 129, 0.1) 50%, transparent)
    `,
            backgroundSize: "100% 1px, 1px 100%",
            backgroundPosition: "0 0, 0 0",
            backgroundRepeat: "no-repeat",
            zIndex: 1,
          }}
        ></div>
      </div>

      {/* Content container with relative positioning */}
      <div className="relative z-10">
        {/* Location header with secret area */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 border-b ${
            themeClasses.borderMuted
          } pb-3 transition-all duration-1000 delay-100 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div>
            <div
              className={`text-xs ${themeClasses.textSecondary}`}
              onTouchStart={() => setSecretTapCount((prev) => prev + 1)}
              onClick={() => setSecretTapCount((prev) => prev + 1)}
            >
              STABLEHOLD_HQ
            </div>
            <div className="text-sm">LEXINGTON, KENTUCKY</div>
          </div>
          <div
            className={`text-xs ${themeClasses.textSecondary} tabular-nums mt-1 sm:mt-0 relative`}
          >
            {new Date().toISOString().split("T")[0].replace(/-/g, ".")}
            {!showSecretButton && secretTapCount > 0 && (
              <div
                className={`absolute -top-6 right-0 text-[10px] ${
                  theme === "sunset"
                    ? "text-amber-500/30"
                    : "text-emerald-500/30"
                }`}
              >
                {3 - secretTapCount > 0 ? `${3 - secretTapCount} more` : ""}
              </div>
            )}
            {/* Secret button */}
            {showSecretButton && (
              <Link
                href="/success"
                className={`absolute -top-8 right-0 bg-black border ${themeClasses.borderColor} rounded-md p-2 opacity-70 hover:opacity-100 transition-opacity`}
                aria-label="Secret access"
              >
                <Lock className={`h-4 w-4 ${themeClasses.textAccent}`} />
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* Main progress circle */}
          <div
            className={`relative flex items-center justify-center transition-opacity duration-1000 delay-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background pulse */}
            <div
              className={`absolute inset-0 rounded-full ${themeClasses.pulseColor} transition-opacity duration-1000 ease-in-out`}
              style={{ opacity: pulseOpacity }}
            />

            {/* Progress circle */}
            <div className="relative h-36 w-36 sm:h-40 sm:w-40 mx-auto">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  className={
                    theme === "sunset"
                      ? "text-amber-900/20"
                      : "text-emerald-900/20"
                  }
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />

                {/* Progress circle */}
                <circle
                  className={`${themeClasses.textPrimary} transition-all duration-1000 ease-out`}
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
                <div className="flex flex-col items-center justify-center h-full py-2">
                  {/* Main number - static without pulsating effect */}
                  <div className="text-5xl sm:text-6xl tabular-nums mb-0.5">
                    {currentValue}
                  </div>

                  {/* PERCENT/DONE text with Apple-like transition */}
                  <div className="h-4 w-20 flex items-center justify-center mb-2">
                    <div
                      className={`text-[9px] sm:text-[10px] tracking-[0.2em] ${themeClasses.textAccent} font-mono font-semibold uppercase`}
                      style={{
                        opacity: textOpacity,
                        transition:
                          "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      {percentText}
                    </div>
                  </div>

                  {/* Timestamp - smaller and more subtle */}
                  <div
                    className={`text-[9px] ${themeClasses.textMuted} tabular-nums`}
                  >
                    {currentTimestamp}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weather widget */}
          <div
            className={`${
              themeClasses.bgSecondary
            } rounded-lg p-3 sm:p-4 transition-opacity duration-1000 delay-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`text-xs ${themeClasses.textSecondary}`}>
                CURRENT_CONDITIONS
              </div>
              <div className="flex items-center">
                <Cloud className="h-4 w-4" />
              </div>
            </div>

            {/* Three weather metrics in a single row - Improved alignment and centering */}
            <div className="flex justify-between items-start mb-4 px-2">
              <div className="flex flex-col items-center text-center">
                <div className="flex justify-center w-full mb-1.5">
                  <Thermometer
                    className={`h-4 w-4 ${themeClasses.textAccent}`}
                  />
                </div>
                <div className="text-base sm:text-lg tabular-nums">
                  {isWeatherLoading ? (
                    <span className="inline-block w-12 h-6 bg-gray-800/50 rounded animate-pulse"></span>
                  ) : (
                    `${weatherData.temp.toFixed(1)}°`
                  )}
                </div>
                <div className={`text-xs ${themeClasses.textSecondary}`}>
                  TEMP_F
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex justify-center w-full mb-1.5">
                  <Wind className={`h-4 w-4 ${themeClasses.textAccent}`} />
                </div>
                <div className="text-base sm:text-lg tabular-nums">
                  {isWeatherLoading ? (
                    <span className="inline-block w-10 h-6 bg-gray-800/50 rounded animate-pulse"></span>
                  ) : (
                    weatherData.windSpeed
                  )}
                </div>
                <div className={`text-xs ${themeClasses.textSecondary}`}>
                  MPH
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex justify-center w-full mb-1.5">
                  <Droplets className={`h-4 w-4 ${themeClasses.textAccent}`} />
                </div>
                <div className="text-base sm:text-lg tabular-nums">
                  {isWeatherLoading ? (
                    <span className="inline-block w-10 h-6 bg-gray-800/50 rounded animate-pulse"></span>
                  ) : (
                    `${weatherData.humidity}%`
                  )}
                </div>
                <div className={`text-xs ${themeClasses.textSecondary}`}>
                  HUMIDITY
                </div>
              </div>
            </div>

            {/* Loading horses message - Now with static text */}
            <div className={`mt-3 border-t ${themeClasses.borderMuted} pt-3`}>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`text-xs ${themeClasses.textSecondary}`}>
                    {phaseLabels[loadingPhase]}
                  </div>
                  <div
                    className={`text-xs ${themeClasses.textSecondary} tabular-nums`}
                  >
                    {loadingProgress}/{totalValue}%
                  </div>
                </div>

                {/* Enhanced Apple-like progress bar with ultra-smooth animation */}
                <div
                  className={`w-full h-1 ${themeClasses.progressBg} rounded-full overflow-hidden`}
                >
                  <div
                    className={`${themeClasses.progressFill} h-full will-change-[width] transform-gpu`}
                    style={{
                      width: `${loadingProgress}%`,
                      transition:
                        "width 800ms cubic-bezier(0.25, 0.1, 0.25, 1.0)",
                      boxShadow:
                        theme === "sunset"
                          ? "0 0 8px 0 rgba(251, 191, 36, 0.3)"
                          : "0 0 8px 0 rgba(16, 185, 129, 0.3)",
                    }}
                  />
                </div>

                <div
                  className={`text-xs tracking-wider text-center w-full mt-2 ${themeClasses.textPrimary}/80`}
                >
                  HORSES LOADING INTO STABLE...
                </div>
              </div>
            </div>
          </div>

          {/* Waitlist Form */}
          <div
            className={`${themeClasses.bgSecondary} rounded-lg p-3 sm:p-4 transition-opacity duration-1000 delay-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`text-xs ${themeClasses.textSecondary}`}>
                JOIN_WAITLIST
              </div>
              <div className={`text-xs ${themeClasses.textSecondary}`}>
                [PRIORITY]
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="email" className="text-xs">
                    EMAIL
                  </label>
                  <span className={`text-xs ${themeClasses.textSecondary}`}>
                    REQ
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-black border ${themeClasses.borderColor} rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-${themeClasses.ringColor} focus:border-${themeClasses.borderFocusColor}`}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${themeClasses.buttonBg} ${themeClasses.buttonText} px-4 py-1.5 rounded text-sm flex items-center justify-center min-w-[90px] transition-colors`}
                >
                  {isSubmitting ? (
                    <span className="h-3 w-3 animate-spin border-2 border-white border-t-transparent rounded-full"></span>
                  ) : (
                    <>
                      <span className="mr-1.5">SUBMIT</span>
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
