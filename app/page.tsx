"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search, Library, Users, Star, TrendingUp } from "lucide-react"

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
          <BookOpen className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">BookShelf</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your personal book tracking companion. Discover, organize, and track your reading journey with ease.
        </p>

        {session ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/search">
                <Search className="mr-2 h-5 w-5" />
                Search Books
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/shelf">
                <Library className="mr-2 h-5 w-5" />
                My Shelf
              </Link>
            </Button>
          </div>
        ) : (
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/signin">Get Started</Link>
          </Button>
        )}
      </div>

      {/* Features Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to track your reading
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Search className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Discover Books</CardTitle>
              <CardDescription>
                Search millions of books using the Google Books API and find your next great read.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Library className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Organize Your Shelf</CardTitle>
              <CardDescription>
                Keep track of books you want to read, are currently reading, or have finished.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                Monitor your reading habits and see your progress over time with detailed statistics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Personal Collection</CardTitle>
              <CardDescription>
                Build your personal library with secure user authentication and data protection.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Beautiful Interface</CardTitle>
              <CardDescription>
                Enjoy a clean, modern interface designed for book lovers with responsive design.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Rich Book Data</CardTitle>
              <CardDescription>
                Access detailed book information including covers, descriptions, and publication details.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      {!session && (
        <div className="text-center py-16 bg-blue-50 rounded-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start your reading journey?</h2>
          <p className="text-xl text-gray-600 mb-8">Join BookShelf today and take control of your reading habits.</p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/auth/signin">Sign Up Now</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
