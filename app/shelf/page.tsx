"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Library, Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Book {
  id: string
  googleId: string
  title: string
  author: string
  imageUrl?: string
  status: string
  createdAt: string
}

const statusOptions = [
  { value: "all", label: "All Books" },
  { value: "want_to_read", label: "Want to Read" },
  { value: "currently_reading", label: "Currently Reading" },
  { value: "read", label: "Read" },
]

const statusColors = {
  want_to_read: "bg-blue-100 text-blue-800",
  currently_reading: "bg-yellow-100 text-yellow-800",
  read: "bg-green-100 text-green-800",
}

export default function ShelfPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [updatingBook, setUpdatingBook] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books")
      const data = await response.json()

      if (response.ok) {
        setBooks(data)
      } else {
        toast({
          title: "Failed to load books",
          description: data.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to load books",
        description: "An error occurred while loading your books",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateBookStatus = async (bookId: string, newStatus: string) => {
    setUpdatingBook(bookId)
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setBooks(books.map((book) => (book.id === bookId ? { ...book, status: newStatus } : book)))
        toast({
          title: "Status updated",
          description: "Book status has been updated successfully",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Failed to update status",
          description: data.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: "An error occurred while updating the book status",
        variant: "destructive",
      })
    } finally {
      setUpdatingBook(null)
    }
  }

  const deleteBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== bookId))
        toast({
          title: "Book removed",
          description: "Book has been removed from your shelf",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Failed to remove book",
          description: data.error || "An error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to remove book",
        description: "An error occurred while removing the book",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const filteredBooks = filter === "all" ? books : books.filter((book) => book.status === filter)

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "want_to_read":
        return "Want to Read"
      case "currently_reading":
        return "Currently Reading"
      case "read":
        return "Read"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-muted-foreground">Loading your books...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Shelf</h1>
            <p className="text-gray-600">Manage your personal book collection</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="h-full">
                <CardHeader>
                  <div className="flex gap-4">
                    {book.imageUrl && (
                      <img
                        src={book.imageUrl || "/placeholder.svg"}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                      <CardDescription className="mt-1">{book.author}</CardDescription>
                      <Badge
                        className={`mt-2 ${statusColors[book.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}
                      >
                        {getStatusLabel(book.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Select
                      value={book.status}
                      onValueChange={(value) => updateBookStatus(book.id, value)}
                      disabled={updatingBook === book.id}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="want_to_read">Want to Read</SelectItem>
                        <SelectItem value="currently_reading">Currently Reading</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteBook(book.id)}
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Library className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "all"
                ? "No books in your shelf"
                : `No ${statusOptions.find((s) => s.value === filter)?.label.toLowerCase()} books`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === "all"
                ? "Start building your collection by searching for books"
                : "Try changing the filter or add some books to your shelf"}
            </p>
            {filter === "all" && (
              <Button asChild>
                <a href="/search">Search Books</a>
              </Button>
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
