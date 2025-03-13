"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface EmailEntry {
  id: number
  email: string
  submitted_at: string
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<EmailEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await fetch(`/api/emails?t=${Date.now()}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch emails: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success) {
          setEmails(data.emails || [])
        } else {
          setError(data.message || "Failed to fetch emails")
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchEmails()
  }, [refreshKey])

  const refreshEmails = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-black text-emerald-500 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Waitlist Emails</h1>

          <div className="flex gap-4">
            <button
              onClick={refreshEmails}
              className="px-4 py-2 bg-emerald-900/50 text-emerald-400 rounded-md hover:bg-emerald-800/50 transition-colors"
            >
              Refresh
            </button>

            <Link
              href="/admin/setup"
              className="px-4 py-2 bg-emerald-900/30 text-emerald-400 rounded-md hover:bg-emerald-800/30 transition-colors"
            >
              Setup
            </Link>

            <Link
              href="/"
              className="px-4 py-2 bg-emerald-900/20 text-emerald-400 rounded-md hover:bg-emerald-800/20 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-900/20 rounded-lg border border-red-900/50 text-red-400">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        ) : emails.length === 0 ? (
          <div className="p-6 bg-emerald-900/20 rounded-lg text-center">
            <p className="text-lg">No emails in the waitlist yet.</p>
            <p className="text-sm mt-2 text-emerald-400/70">Submitted emails will appear here.</p>
          </div>
        ) : (
          <div className="bg-emerald-900/10 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-emerald-900/30">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/20">
                {emails.map((entry) => (
                  <tr key={entry.id} className="hover:bg-emerald-900/20">
                    <td className="px-4 py-3 text-sm">{entry.id}</td>
                    <td className="px-4 py-3 text-sm">{entry.email}</td>
                    <td className="px-4 py-3 text-sm">{new Date(entry.submitted_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 bg-emerald-900/20 border-t border-emerald-900/30">
              <p className="text-sm text-emerald-400/70">Total emails: {emails.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

