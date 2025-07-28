import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const { data: user } = await supabase.from("users").select("id").eq("email", session.user.email).single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { data: books, error } = await supabase
      .from("books")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
    }

    // Transform snake_case to camelCase
    const transformedBooks = books.map((book) => ({
      id: book.id,
      googleId: book.google_id,
      title: book.title,
      author: book.author,
      imageUrl: book.image_url,
      status: book.status,
      createdAt: book.created_at,
    }))

    return NextResponse.json(transformedBooks)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const { data: user } = await supabase.from("users").select("id").eq("email", session.user.email).single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { googleId, title, author, imageUrl, status } = await request.json()

    // Check if book already exists for this user
    const { data: existingBook } = await supabase
      .from("books")
      .select("id")
      .eq("user_id", user.id)
      .eq("google_id", googleId)
      .single()

    if (existingBook) {
      return NextResponse.json({ error: "Book already in your shelf" }, { status: 400 })
    }

    const { data: book, error } = await supabase
      .from("books")
      .insert([
        {
          user_id: user.id,
          google_id: googleId,
          title,
          author,
          image_url: imageUrl,
          status: status || "WANT_TO_READ",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to add book" }, { status: 500 })
    }

    // Transform snake_case to camelCase
    const transformedBook = {
      id: book.id,
      googleId: book.google_id,
      title: book.title,
      author: book.author,
      imageUrl: book.image_url,
      status: book.status,
      createdAt: book.created_at,
    }

    return NextResponse.json(transformedBook, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
