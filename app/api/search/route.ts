import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20&printType=books`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch from Google Books API")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Failed to search books" }, { status: 500 })
  }
}
