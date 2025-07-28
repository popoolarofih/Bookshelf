import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Mock user ID for demo purposes
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"

async function ensureTablesExist() {
  try {
    // Try to create tables if they don't exist
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("/rest/v1", "")}/api/setup`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error ensuring tables exist:", error)
  }
}

export async function GET() {
  try {
    // First check if books table exists by trying a simple query
    const { data: testData, error: testError } = await supabase.from("books").select("id").limit(1)

    if (testError && testError.message.includes("does not exist")) {
      // Table doesn't exist, let's create a simple in-memory response for now
      return NextResponse.json([])
    }

    // Ensure demo user exists
    const { data: user, error: userError } = await supabase.from("users").select("id").eq("id", DEMO_USER_ID).single()

    if (userError && userError.code === "PGRST116") {
      // User doesn't exist, create it
      const { error: createUserError } = await supabase.from("users").insert([
        {
          id: DEMO_USER_ID,
          email: "demo@bookshelf.com",
          name: "Demo User",
        },
      ])

      if (createUserError) {
        console.error("Failed to create demo user:", createUserError)
      }
    }

    // Now fetch the books
    const { data, error } = await supabase
      .from("books")
      .select(`
        id,
        google_id,
        title,
        author,
        image_url,
        description,
        published_date,
        page_count,
        status,
        created_at
      `)
      .eq("user_id", DEMO_USER_ID)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
    }

    // Transform the data to match the frontend expectations
    const transformedData = (data || []).map((book) => ({
      id: book.id,
      googleId: book.google_id,
      title: book.title,
      author: book.author,
      imageUrl: book.image_url,
      description: book.description,
      publishedDate: book.published_date,
      pageCount: book.page_count,
      status: book.status,
      createdAt: book.created_at,
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { googleId, title, author, imageUrl, description, publishedDate, pageCount, status } = body

    // Check if books table exists first
    const { data: testData, error: testError } = await supabase.from("books").select("id").limit(1)

    if (testError && testError.message.includes("does not exist")) {
      return NextResponse.json({ error: "Database not set up. Please contact support." }, { status: 500 })
    }

    // Ensure demo user exists
    const { data: user, error: userError } = await supabase.from("users").select("id").eq("id", DEMO_USER_ID).single()

    if (userError && userError.code === "PGRST116") {
      // User doesn't exist, create it
      const { error: createUserError } = await supabase.from("users").insert([
        {
          id: DEMO_USER_ID,
          email: "demo@bookshelf.com",
          name: "Demo User",
        },
      ])

      if (createUserError) {
        console.error("Failed to create demo user:", createUserError)
        return NextResponse.json({ error: "Failed to create demo user" }, { status: 500 })
      }
    }

    // Check if book already exists for this user
    const { data: existingBook } = await supabase
      .from("books")
      .select("id")
      .eq("user_id", DEMO_USER_ID)
      .eq("google_id", googleId)
      .single()

    if (existingBook) {
      return NextResponse.json({ error: "Book already in your shelf" }, { status: 409 })
    }

    const { data, error } = await supabase
      .from("books")
      .insert([
        {
          user_id: DEMO_USER_ID,
          google_id: googleId,
          title,
          author,
          image_url: imageUrl,
          description,
          published_date: publishedDate,
          page_count: pageCount,
          status: status || "want_to_read",
        },
      ])
      .select(`
        id,
        google_id,
        title,
        author,
        image_url,
        description,
        published_date,
        page_count,
        status,
        created_at
      `)
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to add book" }, { status: 500 })
    }

    // Transform the response
    const transformedData = {
      id: data.id,
      googleId: data.google_id,
      title: data.title,
      author: data.author,
      imageUrl: data.image_url,
      description: data.description,
      publishedDate: data.published_date,
      pageCount: data.page_count,
      status: data.status,
      createdAt: data.created_at,
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
