import { NextResponse } from "next/server"

// OpenWeatherMap Current Weather API endpoint (free tier)
const API_URL = "https://api.openweathermap.org/data/2.5/weather"

// Lexington coordinates
const LATITUDE = 38.0389
const LONGITUDE = -84.5153

export async function GET() {
  try {
    // Get API key from environment variable
    const API_KEY = process.env.OPENWEATHER_API_KEY

    if (!API_KEY) {
      console.error("Missing OpenWeather API key in environment variables")
      return NextResponse.json({ error: "Weather API key not configured" }, { status: 500 })
    }

    // Log the API request (without exposing the API key)
    console.log(`Fetching weather data for Lexington at coordinates: ${LATITUDE}, ${LONGITUDE}`)

    // Fetch weather data from OpenWeatherMap Current Weather API (free tier)
    // Adding units=imperial to get temperature in Fahrenheit
    const response = await fetch(
      `${API_URL}?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${API_KEY}&units=imperial`,
      { cache: "no-store" }, // Disable caching to always get fresh data
    )

    // Handle API errors
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Weather API error (${response.status}): ${errorText}`)

      if (response.status === 401) {
        console.error("API key authentication failed. Please check your OpenWeatherMap API key.")
        return NextResponse.json(
          {
            error: "Invalid API key. Please check your OpenWeatherMap API key in your environment variables.",
            details: "If you just created your API key, it may take a few hours to activate.",
          },
          { status: 401 },
        )
      }

      throw new Error(`Weather API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Weather data fetched successfully")

    // Extract only the data we need from the current weather
    const weatherData = {
      temp: data.main.temp, // Temperature in Fahrenheit
      windSpeed: data.wind.speed, // Wind speed in mph
      humidity: data.main.humidity, // Humidity percentage
      pressure: data.main.pressure, // Atmospheric pressure
      description: data.weather[0]?.description || "Clear",
      icon: data.weather[0]?.icon || "01d",
      cityName: data.name || "Lexington", // Current Weather API returns city name
      timestamp: new Date().toISOString(),
      feelsLike: data.main.feels_like,
      // Note: UV index not available in the free API
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

