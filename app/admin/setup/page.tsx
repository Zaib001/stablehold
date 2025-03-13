"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [errorDetails, setErrorDetails] = useState("")
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "connected" | "error">("checking")
  const [supabaseMessage, setSupabaseMessage] = useState("")
  const [supabaseUrl, setSupabaseUrl] = useState("")

  // Check Supabase connection
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        setSupabaseMessage("Checking Supabase connection...")
        const response = await fetch("/api/check-supabase")
        const data = await response.json()

        if (data.success) {
          setSupabaseStatus("connected")
          setSupabaseMessage(data.message || "Connected to Supabase")

          // Try to get the Supabase URL (masked)
          try {
            const urlResponse = await fetch("/api/get-supabase-url")
            const urlData = await urlResponse.json()
            if (urlData.url) {
              setSupabaseUrl(urlData.url)
            }
          } catch (urlError) {
            console.error("Error getting Supabase URL:", urlError)
          }
        } else {
          setSupabaseStatus("error")
          setSupabaseMessage(data.message || "Failed to connect to Supabase")
        }
      } catch (error) {
        setSupabaseStatus("error")
        setSupabaseMessage("Error checking Supabase connection")
        console.error("Error checking Supabase:", error)
      }
    }

    checkSupabase()
  }, [])

  const setupDatabase = async () => {
    setStatus("loading")
    setMessage("Checking database...")
    setErrorDetails("")

    try {
      const response = await fetch("/api/setup-db")
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message || "Database setup completed successfully")
      } else {
        // If the error is that the table doesn't exist, show manual setup instructions
        if (response.status === 404) {
          setStatus("error")
          setMessage("The waitlist table does not exist. Please follow the manual setup instructions below.")
          setErrorDetails("You need to create the table manually using the SQL Editor in your Supabase dashboard.")
        } else {
          setStatus("error")
          setMessage(data.message || "Failed to set up database")
          setErrorDetails(data.error || "")
        }
        console.error("Setup error details:", data)
      }
    } catch (error) {
      setStatus("error")
      setMessage("An unexpected error occurred")
      console.error("Setup error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-emerald-500 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Supabase Setup</h1>

        <div className="mb-6 p-4 bg-emerald-900/20 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Supabase Connection</h2>
          <div className="flex items-center">
            <div
              className={`h-3 w-3 rounded-full mr-2 ${
                supabaseStatus === "checking"
                  ? "bg-yellow-500"
                  : supabaseStatus === "connected"
                    ? "bg-emerald-500"
                    : "bg-red-500"
              }`}
            ></div>
            <span>
              {supabaseStatus === "checking"
                ? "Checking connection..."
                : supabaseStatus === "connected"
                  ? "Connected to Supabase"
                  : "Connection error"}
            </span>
          </div>

          {supabaseUrl && <p className="text-emerald-400/70 text-sm mt-2">URL: {supabaseUrl}</p>}

          <p className="text-sm mt-2">{supabaseMessage}</p>

          {supabaseStatus === "error" && (
            <div className="mt-4 p-3 bg-red-900/20 rounded border border-red-900/50 text-red-400 text-sm">
              <p className="font-semibold">Troubleshooting:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Check that your Supabase URL and keys are correctly set in environment variables</li>
                <li>Verify that your Supabase project is active and running</li>
                <li>Check for any network restrictions that might block the connection</li>
              </ul>
            </div>
          )}
        </div>

        <div className="mb-6 p-4 bg-emerald-900/20 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Database Setup</h2>
          <p className="text-sm mb-4">Click the button below to set up the waitlist table in your Supabase database.</p>

          <button
            onClick={setupDatabase}
            disabled={status === "loading" || supabaseStatus !== "connected"}
            className={`px-4 py-2 rounded-md ${
              status === "loading" || supabaseStatus !== "connected"
                ? "bg-emerald-900/30 text-emerald-700 cursor-not-allowed"
                : "bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/50"
            } transition-colors`}
          >
            {status === "loading" ? "Checking..." : "Check Database"}
          </button>

          {status === "success" && (
            <div className="mt-4 p-3 bg-emerald-900/30 rounded border border-emerald-900/50 text-emerald-400 text-sm">
              <p className="font-semibold">Success!</p>
              <p className="mt-1">{message}</p>
              <p className="mt-2">You can now use the waitlist form on the homepage to collect emails.</p>
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 p-3 bg-red-900/20 rounded border border-red-900/50 text-red-400 text-sm">
              <p className="font-semibold">Error:</p>
              <p className="mt-1">{message}</p>
              {errorDetails && (
                <div className="mt-2">
                  <p className="font-semibold">Details:</p>
                  <p className="mt-1 break-words">{errorDetails}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-6 p-4 bg-emerald-900/20 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Manual Setup</h2>
          <p className="text-sm mb-4">If the automatic setup fails, you can set up the database manually:</p>

          <ol className="list-decimal pl-5 text-sm space-y-2">
            <li>Log in to your Supabase dashboard</li>
            <li>Go to the SQL Editor</li>
            <li>Create a new query</li>
            <li>Paste the following SQL and run it:</li>
            <pre className="bg-black/50 p-3 rounded mt-2 overflow-x-auto text-xs">
              {`CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
            </pre>
            <li>
              Verify the table was created by running: <code>SELECT * FROM waitlist;</code>
            </li>
          </ol>

          <p className="text-xs mt-4 text-emerald-400/70">
            After setting up the table manually, you can use the waitlist form on the homepage to collect emails.
          </p>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

