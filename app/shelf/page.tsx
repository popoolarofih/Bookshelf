"use client"

import { useState, useEffect } from "react"
import { Library, Filter, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { BookCard } from "@/components/book-card"

interface ShelfBook {
  id: string
  googleId: string
  title: string
  author: string
  imageUrl?: string
  description?: string
  publishedDate?: string
  pageCount?: number
  status: "read" | "currently_reading" | "want_to_read"
  createdAt: string
}

const statusLabels = {
  read: "Read",
  currently_reading: "Currently Reading",
  want_to_read: "Want to Read",
}

const statusColors = {
  read: "status-read",
  currently_reading: "status-currently-reading",
  want_to_read: "status-want-to-read",
}

export default function ShelfPage() {
  const [books, setBooks] = useState<ShelfBook[]>([])
  const [filteredBooks, setFilteredBooks] = useState<ShelfBook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    if (filter === "all") {
      setFilteredBooks(books)
    } else {
      setFilteredBooks(books.filter((book) => book.status === filter))
    }
  }, [books, filter])

  const setupDatabase = async () => {
    try {
      const response = await fetch("/api/setup", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Database setup completed",
          description: "Your database has been initialized successfully.",
        })
        // Retry fetching books
        fetchBooks()
      } else {
        toast({
          title: "Setup failed",
          description: "Failed to set up the database. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "An error occurred during database setup.",
        variant: "destructive",
      })
    }
  }

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/books")

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", errorText)

        if (errorText.includes("does not exist")) {
          setError("database_not_setup")
          return
        }

        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error("Fetch error:", error)
      setError("fetch_failed")
      toast({
        title: "Failed to load books",
        description: "There was an error loading your shelf. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateBookStatus = async (bookId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setBooks(books.map((book) => (book.id === bookId ? { ...book, status: newStatus as any } : book)))
        toast({
          title: "Status updated",
          description: `Book status changed to ${statusLabels[newStatus as keyof typeof statusLabels]}`,
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
    }
  }

  const removeBook = async (bookId: string) => {
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== bookId))
        toast({
          title: "Book removed",
          description: "The book has been removed from your shelf",
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

  const getStatusCounts = () => {
    return {
      all: books.length,
      read: books.filter((b) => b.status === "read").length,
      currently_reading: books.filter((b) => b.status === "currently_reading").length,
      want_to_read: books.filter((b) => b.status === "want_to_read").length,
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
        <p className="text-gray-600">Loading your shelf...</p>
      </div>
    )
  }

  if (error === "database_not_setup") {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            It looks like your database hasn't been set up yet. Click the button below to initialize your BookShelf
            database.
          </AlertDescription>
        </Alert>

        <Card className="text-center py-12">
          <CardContent>
            <Library className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-gray-600 mb-2">Database Setup Required</CardTitle>
            <CardDescription className="mb-6">
              Your BookShelf database needs to be initialized before you can start adding books.
            </CardDescription>
            <Button onClick={setupDatabase} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Set Up Database
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error === "fetch_failed") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-gray-600 mb-2">Failed to Load Shelf</CardTitle>
            <CardDescription className="mb-6">
              There was an error loading your book shelf. Please try again.
            </CardDescription>
            <Button onClick={fetchBooks} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">My Shelf</h1>
        <p className="text-gray-600 mb-6">Manage and track your personal book collection</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="book-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
              <div className="text-sm text-gray-600">Total Books</div>
            </CardContent>
          </Card>
          <Card className="book-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.read}</div>
              <div className="text-sm text-gray-600">Read</div>
            </CardContent>
          </Card>
          <Card className="book-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.currently_reading}</div>
              <div className="text-sm text-gray-600">Reading</div>
            </CardContent>
          </Card>
          <Card className="book-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.want_to_read}</div>
              <div className="text-sm text-gray-600">Want to Read</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books ({statusCounts.all})</SelectItem>
              <SelectItem value="read">Read ({statusCounts.read})</SelectItem>
              <SelectItem value="currently_reading">Currently Reading ({statusCounts.currently_reading})</SelectItem>
              <SelectItem value="want_to_read">Want to Read ({statusCounts.want_to_read})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Library className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-gray-600 mb-2">
              {filter === "all"
                ? "Your shelf is empty"
                : `No ${statusLabels[filter as keyof typeof statusLabels]?.toLowerCase()} books`}
            </CardTitle>
            <CardDescription className="mb-4">
              {filter === "all"
                ? "Start building your library by searching for books to add"
                : `You don't have any books marked as ${statusLabels[filter as keyof typeof statusLabels]?.toLowerCase()}`}
            </CardDescription>
            {filter === "all" && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href="/search">Search Books</a>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onStatusChange={(newStatus) => updateBookStatus(book.id, newStatus)}
              onRemove={() => removeBook(book.id)}
              showShelfActions={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
