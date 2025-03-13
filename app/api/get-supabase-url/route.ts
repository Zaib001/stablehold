import { NextResponse } from "next/server"

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""

    // Mask the URL for security (show only the domain)
    let maskedUrl = ""
    if (url) {
      try {
        const urlObj = new URL(url)
        maskedUrl = urlObj.hostname
      } catch (e) {
        maskedUrl = "Invalid URL format"
      }
    }

    return NextResponse.json({
      url: maskedUrl || "Not configured",
    })
  } catch (error) {
    return NextResponse.json({
      url: "Error retrieving URL",
    })
  }
}

