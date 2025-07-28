import Link from "next/link"
import { BookOpen, Search, Library, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-600 rounded-full">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Welcome to BookShelf</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your personal book tracking companion. Discover new books, organize your reading list, and track your reading
          journey all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/search">
              <Search className="mr-2 h-5 w-5" />
              Search Books
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <Link href="/shelf">
              <Library className="mr-2 h-5 w-5" />
              View My Shelf
            </Link>
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="book-card">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit mb-4">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-blue-900">Discover Books</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Search millions of books using the Google Books API. Find your next great read with detailed information
              and reviews.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="book-card">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-green-100 rounded-full w-fit mb-4">
              <Library className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-blue-900">Organize Your Shelf</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Keep track of books you want to read, are currently reading, or have finished. Your personal library,
              organized.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="book-card">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-yellow-100 rounded-full w-fit mb-4">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-blue-900">Track Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-center">
              Monitor your reading journey with status updates and see your reading habits evolve over time.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Start Your Reading Journey Today</h2>
          <p className="mb-6 opacity-90">
            Join thousands of readers who use BookShelf to discover, organize, and track their favorite books.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/search">Get Started</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
