"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { BookCard } from "@/components/book-card"

interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
    }
    publishedDate?: string
    pageCount?: number
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const { toast } = useToast()

  const searchBooks = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (response.ok) {
        setBooks(data.items || [])
        setSearched(true)
      } else {
        toast({
          title: "Search failed",
          description: data.error || "Failed to search books",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "An error occurred while searching",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addToShelf = async (book: Book, status = "want_to_read") => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleId: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.join(", ") || "Unknown Author",
          imageUrl: book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail,
          description: book.volumeInfo.description,
          publishedDate: book.volumeInfo.publishedDate,
          pageCount: book.volumeInfo.pageCount,
          status,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Book added!",
          description: `"${book.volumeInfo.title}" has been added to your shelf.`,
        })
      } else {
        toast({
          title: "Failed to add book",
          description: data.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to add book",
        description: "An error occurred while adding the book",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Search Books</h1>
        <p className="text-gray-600 mb-6">Discover your next great read from millions of books</p>

        <form onSubmit={searchBooks} className="flex gap-4 max-w-2xl">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for books, authors, or ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 border-blue-200 focus:border-blue-400"
            />
          </div>
          <Button type="submit" disabled={loading || !query.trim()} className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Searching for books...</p>
        </div>
      )}

      {searched && !loading && books.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-gray-600 mb-2">No books found</CardTitle>
            <CardDescription>Try searching with different keywords or check your spelling</CardDescription>
          </CardContent>
        </Card>
      )}

      {books.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-blue-900">Search Results ({books.length} books)</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={{
                  id: book.id,
                  title: book.volumeInfo.title,
                  author: book.volumeInfo.authors?.join(", ") || "Unknown Author",
                  imageUrl: book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail,
                  description: book.volumeInfo.description,
                  publishedDate: book.volumeInfo.publishedDate,
                  pageCount: book.volumeInfo.pageCount,
                }}
                onAddToShelf={(status) => addToShelf(book, status)}
                showAddButton={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
