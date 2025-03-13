"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Zap, Send, MessageSquare } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Time period types
type TimePeriod = "morning" | "day" | "sunset" | "night";

export default function SuccessPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pulseOpacity, setPulseOpacity] = useState(0.5);
  const [currentTimestamp, setCurrentTimestamp] = useState(
    Math.floor(Date.now() / 1000)
  );
  const [accessCode, setAccessCode] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [currentTheme, setCurrentTheme] = useState("emerald");
  const [email, setEmail] = useState<string | null>(null);
  // Function to determine the current time period based on Eastern Time
  const determineTimePeriod = (date: Date): TimePeriod => {
    // Convert to EST (UTC-5)
    const estOptions = { timeZone: "America/New_York" };
    const estTimeStr = date.toLocaleString("en-US", estOptions);
    const estTime = new Date(estTimeStr);
    const hours = estTime.getHours();

    // Determine time period based on hour
    if (hours >= 5 && hours < 11) {
      return "morning"; // 5am-11am: Morning
    } else if (hours >= 11 && hours < 18) {
      return "day"; // 11am-6pm: Day
    } else if (hours === 18) {
      return "sunset"; // 6pm-7pm: Sunset (specifically 6pm hour)
    } else {
      return "night"; // 7pm-5am: Night
    }
  };

  // Generate random access code
  useEffect(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAccessCode(code);
  }, []);

  // Use the same background as the homepage for consistency
  // Make the same change in the success page to ensure consistency
  // Remove any code that might update the time period after initial load
  // We only need to check the time period once when the component mounts
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      // Get stored background image and theme from localStorage
      const storedBackground = localStorage.getItem("selectedBackgroundImage");
      const storedTheme = localStorage.getItem("currentTheme");

      if (storedBackground) {
        setBackgroundImage(storedBackground);
      } else {
        // If no stored background, determine current time period and set theme accordingly
        const now = new Date();
        const currentPeriod = determineTimePeriod(now);
        setCurrentTheme(currentPeriod === "sunset" ? "sunset" : "emerald");

        // We don't have a background image to set here, but we can at least set the theme
        console.log(
          `No stored background, using current time period: ${currentPeriod}`
        );
      }

      if (storedTheme) {
        setCurrentTheme(storedTheme);
      }
    }
  }, []);

  // Fade-in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // One-time background opacity rise instead of continuous pulse - same as homepage
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

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleJoinTelegram = () => {
    window.location.href = "https://t.me/stablehold";
  
    // Save email in the background without blocking redirection
    (async () => {
      if (!email) return;
      try {
        await supabase.from("wishlists").insert([{ email, joined_telegram: true }]);
        localStorage.removeItem("user_email"); // Clean up storage
      } catch (error) {
        console.error("Error saving email:", error);
      }
    })();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      {/* Background image with overlay - same as homepage */}
      <div
        className={`fixed inset-0 transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter:
              currentTheme === "sunset"
                ? "brightness(0.5) saturate(0.9)"
                : "brightness(0.6) saturate(0.8)",
          }}
        />
        {/* Overlay - improved gradient for better visibility with darker bottom */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent"
          style={{ backdropFilter: "blur(0.5px)" }}
        />
      </div>

      <div className="w-full max-w-screen-lg mx-auto flex items-center justify-center relative z-10">
        <div
          className={`mx-auto bg-black ${
            currentTheme === "sunset" ? "text-amber-500" : "text-emerald-500"
          } p-3 sm:p-5 rounded-xl border ${
            currentTheme === "sunset"
              ? "border-amber-900/50"
              : "border-emerald-900/50"
          } shadow-lg font-mono transition-opacity duration-1000 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          } w-[85%] max-w-[350px] sm:w-full sm:max-w-sm`}
        >
          {/* Header with back button */}
          <div
            className={`flex items-center justify-between mb-3 border-b ${
              currentTheme === "sunset"
                ? "border-amber-900/30"
                : "border-emerald-900/30"
            } pb-2 transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <Link
              href="/"
              className={`flex items-center gap-1 text-xs ${
                currentTheme === "sunset"
                  ? "text-amber-500/70 hover:text-amber-400"
                  : "text-emerald-500/70 hover:text-emerald-400"
              } transition-colors p-1`}
            >
              <ArrowLeft className="h-3 w-3" />
              <span>RETURN</span>
            </Link>
            <div
              className={`text-xs ${
                currentTheme === "sunset"
                  ? "text-amber-500/70"
                  : "text-emerald-500/70"
              } tabular-nums`}
            >
              {currentTimestamp}
            </div>
          </div>

          <div className="space-y-4">
            {/* Success circle */}
            <div
              className={`relative flex items-center justify-center transition-all duration-700 delay-200 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              {/* Background pulse */}
              <div
                className={`absolute inset-0 rounded-full ${
                  currentTheme === "sunset"
                    ? "bg-amber-500/10"
                    : "bg-emerald-500/10"
                } transition-opacity duration-1000 ease-in-out`}
                style={{ opacity: pulseOpacity }}
              />

              {/* Success circle */}
              <div className="relative h-28 w-28 xs:h-32 xs:w-32 sm:h-40 sm:w-40 mx-auto">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    className={
                      currentTheme === "sunset"
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

                  {/* Success circle */}
                  <circle
                    className={
                      currentTheme === "sunset"
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Send
                    className={`h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 ${
                      currentTheme === "sunset"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    } mb-1 xs:mb-1.5 sm:mb-2`}
                  />
                  <div className="text-[10px] xs:text-xs sm:text-sm text-center">
                    CONFIRMED
                  </div>
                  <div className="flex items-center gap-0.5 xs:gap-1 mt-1 xs:mt-1.5 sm:mt-2">
                    <Zap
                      className={`h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3 ${
                        currentTheme === "sunset"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    />
                    <span className="text-[8px] xs:text-[9px] sm:text-xs tabular-nums">
                      PRIORITY
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Access code */}
            <div
              className={`${
                currentTheme === "sunset"
                  ? "bg-amber-900/20"
                  : "bg-emerald-900/20"
              } rounded-lg p-2.5 xs:p-3 sm:p-4 transition-all duration-700 delay-300 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              <div className="flex items-center justify-between mb-2 xs:mb-3">
                <div
                  className={`text-[10px] xs:text-xs ${
                    currentTheme === "sunset"
                      ? "text-amber-500/70"
                      : "text-emerald-500/70"
                  }`}
                >
                  ACCESS_CODE
                </div>
                <div
                  className={`text-[10px] xs:text-xs ${
                    currentTheme === "sunset"
                      ? "text-amber-500/70"
                      : "text-emerald-500/70"
                  }`}
                >
                  [SECURE]
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-1">
                <div
                  className={`text-base xs:text-lg sm:text-2xl tracking-wider font-mono ${
                    currentTheme === "sunset"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {accessCode}
                </div>
                <div
                  className={`text-[8px] xs:text-[10px] sm:text-xs ${
                    currentTheme === "sunset"
                      ? "text-amber-500/70"
                      : "text-emerald-500/70"
                  } mt-1 xs:mt-1.5`}
                >
                  SAVE THIS CODE
                </div>
              </div>
            </div>

            {/* Telegram invitation */}
            <div
              className={`${
                currentTheme === "sunset"
                  ? "bg-amber-900/20"
                  : "bg-emerald-900/20"
              } rounded-lg p-2.5 xs:p-3 sm:p-4 transition-all duration-700 delay-400 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              <div className="flex items-center justify-between mb-2 xs:mb-3">
                <div
                  className={`text-[10px] xs:text-xs ${
                    currentTheme === "sunset"
                      ? "text-amber-500/70"
                      : "text-emerald-500/70"
                  }`}
                >
                  NEXT_STEPS
                </div>
                <MessageSquare className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
              </div>

              <div className="space-y-2.5 xs:space-y-3 sm:space-y-4">
                <div className="flex flex-col items-center text-center space-y-0.5 xs:space-y-1 sm:space-y-2">
                  <div
                    className={`text-[9px] xs:text-[10px] sm:text-xs ${
                      currentTheme === "sunset"
                        ? "text-amber-500/70"
                        : "text-emerald-500/70"
                    } tracking-wider`}
                  >
                    STABLEHOLD'S
                  </div>
                  <div className="text-xs xs:text-sm sm:text-lg font-semibold tracking-wide">
                    OWNERS CLUB
                  </div>
                  <div
                    className={`text-[10px] xs:text-xs sm:text-sm ${
                      currentTheme === "sunset"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    } tracking-widest`}
                  >
                    TELEGRAM
                  </div>
                </div>

                <div className="flex justify-center mt-2 xs:mt-3 sm:mt-4">
                  <button
                    onClick={handleJoinTelegram}
                    className={`relative ${
                      currentTheme === "sunset"
                        ? "bg-amber-900/50 hover:bg-amber-800/70 text-amber-400"
                        : "bg-emerald-900/50 hover:bg-emerald-800/70 text-emerald-400"
                    } px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded text-[10px] xs:text-xs sm:text-sm flex items-center justify-center transition-colors animate-none group`}
                  >
                    {/* Pulsating background effect */}
                    <span
                      className={`absolute inset-0 rounded ${
                        currentTheme === "sunset"
                          ? "bg-amber-500/10"
                          : "bg-emerald-500/10"
                      } animate-pulse-slow pointer-events-none`}
                    ></span>

                    {/* Button glow effect */}
                    <span
                      className={`absolute inset-0 rounded ${
                        currentTheme === "sunset"
                          ? "bg-amber-500/5"
                          : "bg-emerald-500/5"
                      } animate-pulse-glow pointer-events-none`}
                    ></span>

                    {/* Button content */}
                    <MessageSquare className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 mr-1 xs:mr-1.5 sm:mr-2 relative z-10 group-hover:animate-pulse" />
                    <span className="tracking-wider relative z-10">
                      JOIN TELEGRAM
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* System status */}
            <div
              className={`flex items-center justify-between text-[9px] xs:text-[10px] sm:text-xs ${
                currentTheme === "sunset"
                  ? "text-amber-500/70"
                  : "text-emerald-500/70"
              } transition-all duration-700 delay-500 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              <div>STATUS: ACTIVE</div>
              <div>
                SYS:{" "}
                {Math.floor(Math.random() * 999)
                  .toString()
                  .padStart(3, "0")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
