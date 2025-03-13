"use server"

import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with service role key for server-side operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    persistSession: false,
  },
})

// Update the server action to return a success status instead of redirecting

export async function submitEmail(formData: FormData) {
  const email = formData.get("email") as string

  console.log("=== EMAIL SUBMISSION START ===")
  console.log(`Received email submission: ${email}`)

  if (!email) {
    console.error("Email is required but was not provided")
    return {
      success: false,
      message: "Email is required",
    }
  }

  try {
    // Log connection details (masked)
    console.log(`Connected to Supabase at: ${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname}`)
    console.log(`Using service role key: ${process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 5)}...`)

    // Check if email already exists
    console.log(`Checking if email already exists: ${email}`)
    const { data: existingEmails, error: checkError } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .limit(1)

    if (checkError) {
      console.error("Error checking for existing email:", checkError)
      // Continue anyway - we'll handle duplicates with the unique constraint
    }

    // If email already exists, return success
    if (existingEmails && existingEmails.length > 0) {
      console.log("Email already exists in waitlist:", email)
      console.log("=== EMAIL SUBMISSION END (ALREADY EXISTS) ===")

      return {
        success: true,
        message: "Email already exists",
      }
    }

    // Insert email into waitlist table
    console.log(`Inserting email into waitlist: ${email}`)
    const { error } = await supabase.from("waitlist").insert([{ email, submitted_at: new Date().toISOString() }])

    if (error) {
      console.error("Error inserting email:", error)

      // If it's a unique violation, the email was added by someone else
      // between our check and insert - still return success
      if (error.code === "23505") {
        // Unique violation code
        console.log("Email was added by someone else (unique violation):", email)
        console.log("=== EMAIL SUBMISSION END (UNIQUE VIOLATION) ===")

        return {
          success: true,
          message: "Email already exists (unique violation)",
        }
      }

      console.log("=== EMAIL SUBMISSION END (ERROR) ===")
      return {
        success: false,
        message: "Failed to submit email",
        error: error.message,
      }
    }

    console.log("Email submitted successfully:", email)
    console.log("=== EMAIL SUBMISSION END (SUCCESS) ===")

    return {
      success: true,
      message: "Email submitted successfully",
    }
  } catch (error) {
    console.error("Error in submitEmail action:", error)
    console.log("=== EMAIL SUBMISSION END (EXCEPTION) ===")
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

