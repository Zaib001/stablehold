import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Get the email from the query string
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email") || "test@example.com"

  console.log(`Attempting to insert test email: ${email}`)

  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        persistSession: false,
      },
    })

    // Log connection details (masked)
    console.log(`Connected to Supabase at: ${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname}`)
    console.log(`Using service role key: ${process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 5)}...`)

    // First, check if the table exists
    console.log("Checking if waitlist table exists...")
    const { error: checkError } = await supabase.from("waitlist").select("*").limit(1)

    if (checkError) {
      console.error("Error checking waitlist table:", checkError)
      return NextResponse.json(
        {
          success: false,
          message: "Error checking waitlist table",
          error: checkError.message,
        },
        { status: 500 },
      )
    }

    console.log("Waitlist table exists, attempting to insert email...")

    // Insert the test email
    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ email, submitted_at: new Date().toISOString() }])
      .select()

    if (error) {
      console.error("Error inserting test email:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to insert test email",
          error: error.message,
        },
        { status: 500 },
      )
    }

    console.log("Test email inserted successfully:", data)

    return NextResponse.json({
      success: true,
      message: `Test email ${email} inserted successfully`,
      data,
    })
  } catch (error) {
    console.error("Unexpected error in test-email-insert:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

