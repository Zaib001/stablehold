import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        persistSession: false,
      },
    })

    // Fetch all emails from the waitlist table
    const { data, error } = await supabase.from("waitlist").select("*").order("submitted_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch emails: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      emails: data,
    })
  } catch (error) {
    console.error("Error fetching emails:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

