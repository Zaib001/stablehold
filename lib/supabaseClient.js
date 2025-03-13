import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mswyoeoctqvjctjqysll.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zd3lvZW9jdHF2amN0anF5c2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODI4MDIsImV4cCI6MjA1NzQ1ODgwMn0.VH4i6zHCKrnvJW_YhRWeLfzlnQIjM4O0b8M7qUom3sk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
