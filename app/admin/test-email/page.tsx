"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { submitEmail } from "@/app/actions/email-actions"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [directTestResult, setDirectTestResult] = useState<any>(null)
  const [directTestLoading, setDirectTestLoading] = useState(false)
  const [actionTestLoading, setActionTestLoading] = useState(false)
  const [actionTestError, setActionTestError] = useState("")

  const testDirectInsert = async () => {
    if (!email) return

    setDirectTestLoading(true)
    setDirectTestResult(null)

    try {
      const response = await fetch(`/api/test-email-insert?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setDirectTestResult(data)
    } catch (error) {
      setDirectTestResult({
        success: false,
        message: "Error making request",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setDirectTestLoading(false)
    }
  }

  const testActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setActionTestLoading(true)
    setActionTestError("")

    try {
      // Create a FormData object
      const formData = new FormData()
      formData.append("email", email)

      // Call the server action directly
      const result = await submitEmail(formData)

      // If we get here, the redirect didn't happen
      if (result && !result.success) {
        setActionTestError(result.message || "Unknown error")
      } else {
        setActionTestError("No redirect occurred, but no error was returned")
      }
    } catch (error) {
      setActionTestError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setActionTestLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-emerald-500 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Email Submission Testing</h1>

        <div className="mb-6">
          <div className="flex gap-4 mb-6">
            <Link
              href="/admin/setup"
              className="px-4 py-2 bg-emerald-900/30 text-emerald-400 rounded-md hover:bg-emerald-800/30 transition-colors"
            >
              Setup
            </Link>

            <Link
              href="/admin/emails"
              className="px-4 py-2 bg-emerald-900/30 text-emerald-400 rounded-md hover:bg-emerald-800/30 transition-colors"
            >
              View Emails
            </Link>

            <Link
              href="/"
              className="px-4 py-2 bg-emerald-900/20 text-emerald-400 rounded-md hover:bg-emerald-800/20 transition-colors"
            >
              Home
            </Link>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Test Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-emerald-900/50 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="test@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Direct API Test */}
          <div className="p-4 bg-emerald-900/20 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Test Direct API Insert</h2>
            <p className="text-sm mb-4">This will test inserting an email directly via the API endpoint.</p>

            <button
              onClick={testDirectInsert}
              disabled={directTestLoading || !email}
              className={`w-full px-4 py-2 rounded-md ${
                directTestLoading || !email
                  ? "bg-emerald-900/30 text-emerald-700 cursor-not-allowed"
                  : "bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/50"
              } transition-colors`}
            >
              {directTestLoading ? "Testing..." : "Test Direct Insert"}
            </button>

            {directTestResult && (
              <div
                className={`mt-4 p-3 rounded border text-sm ${
                  directTestResult.success
                    ? "bg-emerald-900/30 border-emerald-900/50 text-emerald-400"
                    : "bg-red-900/20 border-red-900/50 text-red-400"
                }`}
              >
                <p className="font-semibold">{directTestResult.success ? "Success" : "Error"}</p>
                <p className="mt-1">{directTestResult.message}</p>
                {directTestResult.error && <p className="mt-1 break-words">{directTestResult.error}</p>}
              </div>
            )}
          </div>

          {/* Server Action Test */}
          <div className="p-4 bg-emerald-900/20 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Test Server Action</h2>
            <p className="text-sm mb-4">This will test the server action used by the form.</p>

            <form onSubmit={testActionSubmit}>
              <button
                type="submit"
                disabled={actionTestLoading || !email}
                className={`w-full px-4 py-2 rounded-md ${
                  actionTestLoading || !email
                    ? "bg-emerald-900/30 text-emerald-700 cursor-not-allowed"
                    : "bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/50"
                } transition-colors`}
              >
                {actionTestLoading ? "Testing..." : "Test Server Action"}
              </button>
            </form>

            {actionTestError && (
              <div className="mt-4 p-3 bg-red-900/20 rounded border border-red-900/50 text-red-400 text-sm">
                <p className="font-semibold">Error:</p>
                <p className="mt-1">{actionTestError}</p>
                <p className="mt-2 text-xs">
                  Note: If the action works correctly, you should be redirected to the success page.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-emerald-900/10 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Troubleshooting</h2>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li>Check the browser console and server logs for detailed error messages</li>
            <li>Verify that your Supabase service role key has write permissions</li>
            <li>Make sure the waitlist table exists and has the correct structure</li>
            <li>Try the direct API test first to isolate database connection issues</li>
            <li>If the direct test works but the form doesn't, there might be an issue with the form submission</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

