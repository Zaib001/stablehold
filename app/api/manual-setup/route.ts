import { NextResponse } from "next/server"

// This endpoint provides instructions for manual setup
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Please follow these instructions to set up your database manually",
    instructions: [
      "1. Log in to your Supabase dashboard",
      "2. Go to the SQL Editor",
      "3. Create a new query",
      "4. Paste the following SQL and run it:",
      `
CREATE TABLE IF NOT EXISTS waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `,
      "5. Verify the table was created by running: SELECT * FROM waitlist;",
    ],
  })
}

