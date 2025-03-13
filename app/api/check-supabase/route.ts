import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if Supabase environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase environment variables are not set",
        },
        { status: 500 },
      )
    }

    // Initialize Supabase client
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    // Test the connection with a simple query
    const { error } = await supabase.from("_test_connection").select("*").limit(1).maybeSingle()

    // If there's an error, check if it's just because the table doesn't exist
    // Both "PGRST116" and "relation does not exist" errors are acceptable
    // as they indicate the connection works but the table doesn't exist
    if (error && error.code !== "PGRST116" && !error.message.includes("does not exist")) {
      throw new Error(`Supabase connection error: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Supabase",
    })
  } catch (error) {
    console.error("Error checking Supabase connection:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error connecting to Supabase",
      },
      { status: 500 },
    )
  }
}

