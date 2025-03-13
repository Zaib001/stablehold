// This simulates a backend that increases progress by 1% every day
export async function getCurrentProgress(): Promise<number> {
  // Start date (when progress was 0%)
  const startDate = new Date("2024-01-01")

  // Current date
  const currentDate = new Date()

  // Calculate days passed since start date
  const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate progress (1% per day)
  // For this demo, we'll use the actual calculation instead of hardcoding
  const progress = Math.min(daysPassed, 100)

  // For testing purposes, we'll still return 20% as specified in the requirements
  // In a real application, you would return the calculated progress
  return 20 // Replace with 'progress' to use the actual calculation
}

