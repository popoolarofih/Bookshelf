import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST() {
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (usersError) {
      console.error("Error creating users table:", usersError)
    }

    // Create book status enum
    const { error: enumError } = await supabase.rpc("exec_sql", {
      sql: `
        DO $$ BEGIN
          CREATE TYPE book_status AS ENUM ('read', 'currently_reading', 'want_to_read');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `,
    })

    if (enumError) {
      console.error("Error creating enum:", enumError)
    }

    // Create books table
    const { error: booksError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS books (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          google_id VARCHAR(255) NOT NULL,
          title VARCHAR(500) NOT NULL,
          author VARCHAR(500),
          image_url TEXT,
          description TEXT,
          published_date VARCHAR(50),
          page_count INTEGER,
          status VARCHAR(50) DEFAULT 'want_to_read',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, google_id)
        );
      `,
    })

    if (booksError) {
      console.error("Error creating books table:", booksError)
    }

    // Create indexes
    const { error: indexError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
        CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
        CREATE INDEX IF NOT EXISTS idx_books_google_id ON books(google_id);
      `,
    })

    if (indexError) {
      console.error("Error creating indexes:", indexError)
    }

    // Insert demo user
    const { error: demoUserError } = await supabase.from("users").upsert([
      {
        id: "00000000-0000-0000-0000-000000000001",
        email: "demo@bookshelf.com",
        name: "Demo User",
      },
    ])

    if (demoUserError) {
      console.error("Error creating demo user:", demoUserError)
    }

    return NextResponse.json({ success: true, message: "Database setup completed" })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}
