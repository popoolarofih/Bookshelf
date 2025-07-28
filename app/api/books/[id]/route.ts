import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Mock user ID for demo purposes
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status } = body

    const { data, error } = await supabase
      .from("books")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", DEMO_USER_ID)
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
      return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("books").delete().eq("id", params.id).eq("user_id", DEMO_USER_ID)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
