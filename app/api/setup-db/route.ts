import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// This is a protected route that you can call to set up your database
// Access it at /api/setup-db with a GET request
export async function GET() {
  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        persistSession: false,
      },
    })

    // Log the connection attempt
    console.log("Attempting to connect to Supabase...")

    // Check if the table exists by trying to select from it
    const { error: checkError } = await supabase.from("waitlist").select("*").limit(1)

    if (checkError) {
      console.log("Table check error (this is expected if the table doesn't exist yet):", checkError.message)

      // The table doesn't exist, but we can't create it automatically
      // Return instructions for manual setup
      return NextResponse.json(
        {
          success: false,
          message: "The waitlist table does not exist. Please set it up manually.",
          error: "Please use the manual setup instructions on the setup page.",
        },
        { status: 404 },
      )
    }

    // If we get here, the table exists
    console.log("Waitlist table exists and is accessible")

    return NextResponse.json({
      success: true,
      message: "Waitlist table exists and is ready to use",
    })
  } catch (error) {
    console.error("Error checking database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

