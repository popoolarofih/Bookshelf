"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Book {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    imageLinks?: {
      thumbnail: string
    }
    publishedDate?: string
    pageCount?: number
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [addingBook, setAddingBook] = useState<string | null>(null)
  const { toast } = useToast()

  const searchBooks = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (response.ok) {
        setBooks(data.items || [])
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

  const addToShelf = async (book: Book) => {
    setAddingBook(book.id)
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
          imageUrl: book.volumeInfo.imageLinks?.thumbnail || "",
          description: book.volumeInfo.description || "",
          publishedDate: book.volumeInfo.publishedDate || "",
          pageCount: book.volumeInfo.pageCount || 0,
          status: "want_to_read",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Book added!",
          description: `"${book.volumeInfo.title}" has been added to your shelf`,
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
    } finally {
      setAddingBook(null)
    }
  }

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Books</h1>
          <p className="text-gray-600">Discover new books to add to your collection</p>
        </div>

        <div className="mb-8">
          <div className="flex gap-4">
            <Input
              placeholder="Search for books..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchBooks()}
              className="flex-1"
            />
            <Button onClick={searchBooks} disabled={loading || !query.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </Button>
          </div>
        </div>

        {books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card key={book.id} className="h-full">
                <CardHeader>
                  <div className="flex gap-4">
                    {book.volumeInfo.imageLinks?.thumbnail && (
                      <img
                        src={book.volumeInfo.imageLinks.thumbnail || "/placeholder.svg"}
                        alt={book.volumeInfo.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{book.volumeInfo.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                      </CardDescription>
                      {book.volumeInfo.publishedDate && (
                        <Badge variant="secondary" className="mt-2">
                          {new Date(book.volumeInfo.publishedDate).getFullYear()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {book.volumeInfo.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{book.volumeInfo.description}</p>
                  )}
                  <Button onClick={() => addToShelf(book)} disabled={addingBook === book.id} className="w-full">
                    {addingBook === book.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add to Shelf
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && books.length === 0 && query && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try searching with different keywords</p>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
