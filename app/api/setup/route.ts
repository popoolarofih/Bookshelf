import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create users table if it doesn't exist
    await supabase.rpc("exec", {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          image TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    // Create books table if it doesn't exist
    await supabase.rpc("exec", {
      sql: `
        CREATE TABLE IF NOT EXISTS books (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          google_id VARCHAR(255) NOT NULL,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          image_url TEXT,
          description TEXT,
          published_date VARCHAR(50),
          page_count INTEGER,
          status VARCHAR(50) DEFAULT 'want_to_read' CHECK (status IN ('read', 'currently_reading', 'want_to_read')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, google_id)
        );
      `,
    })

    // Create indexes for better performance
    await supabase.rpc("exec", {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
        CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      `,
    })

    // Ensure current user exists in users table
    const { data: existingUser } = await supabase.from("users").select("*").eq("email", session.user.email).single()

    if (!existingUser) {
      await supabase.from("users").insert([
        {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          created_at: new Date().toISOString(),
        },
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Setup failed: " + (error as Error).message }, { status: 500 })
  }
}
