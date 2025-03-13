"use client"

import { useState, useEffect } from "react"

export default function TestWeather() {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string>("")

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/weather?t=${Date.now()}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `API responded with status: ${response.status}`)
        }

        const data = await response.json()
        setWeatherData(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Weather API Test</h1>

      {loading && <p>Loading weather data...</p>}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">
            This could be due to an issue with your OpenWeatherMap API key. Make sure it's correctly set in your
            environment variables.
          </p>
        </div>
      )}

      {weatherData && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl mb-2">Weather in {weatherData.cityName || "Lexington"}</h2>
          <p>Temperature: {weatherData.temp}°F</p>
          <p>Wind Speed: {weatherData.windSpeed} mph</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Description: {weatherData.description}</p>
          <p className="text-xs mt-4">Last updated: {new Date(weatherData.timestamp).toLocaleString()}</p>

          <div className="mt-4">
            <pre className="bg-gray-200 p-2 rounded text-xs overflow-auto">{JSON.stringify(weatherData, null, 2)}</pre>
          </div>

          {weatherData && weatherData.feelsLike && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold mb-2">Additional Data:</h3>
              <p>Feels Like: {weatherData.feelsLike}°F</p>
              {weatherData.uvIndex !== undefined && <p>UV Index: {weatherData.uvIndex}</p>}

              {weatherData.dailyForecast && weatherData.dailyForecast.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">3-Day Forecast:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {weatherData.dailyForecast.map((day, index) => (
                      <div key={index} className="bg-white p-2 rounded shadow-sm">
                        <p className="font-medium">{day.date}</p>
                        <p>
                          {day.tempMax.toFixed(0)}° / {day.tempMin.toFixed(0)}°
                        </p>
                        <p className="text-xs">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-bold mb-2">Troubleshooting</h3>
        <p className="mb-2">If you're seeing a 401 error with "Invalid API key", please follow these steps:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Get a valid API key:</strong> Sign up for a free API key at{" "}
            <a
              href="https://home.openweathermap.org/users/sign_up"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              OpenWeatherMap
            </a>
          </li>
          <li>
            <strong>Wait for activation:</strong> New API keys may take a few hours to activate. Please wait if you just
            created your key.
          </li>
          <li>
            <strong>Add to environment variables:</strong> Add the OPENWEATHER_API_KEY to your Vercel project's
            environment variables.
          </li>
          <li>
            <strong>Verify format:</strong> Make sure the API key doesn't have any extra spaces or characters.
          </li>
          <li>
            <strong>Redeploy:</strong> After updating the environment variable, redeploy your application.
          </li>
        </ol>
        <p className="mt-4 text-sm">
          <strong>Note:</strong> The application will use fallback weather data if the API key is invalid, so the main
          functionality will still work.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Refresh Data
      </button>
    </div>
  )
}

