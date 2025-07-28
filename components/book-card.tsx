"use client"

import Image from "next/image"
import { useState } from "react"
import { Plus, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BookCardProps {
  book: {
    id: string
    title: string
    author: string
    imageUrl?: string
    description?: string
    publishedDate?: string
    pageCount?: number
    status?: "read" | "currently_reading" | "want_to_read"
  }
  onAddToShelf?: (status: string) => void
  onStatusChange?: (status: string) => void
  onRemove?: () => void
  showAddButton?: boolean
  showShelfActions?: boolean
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

export function BookCard({
  book,
  onAddToShelf,
  onStatusChange,
  onRemove,
  showAddButton = false,
  showShelfActions = false,
}: BookCardProps) {
  const [showAddOptions, setShowAddOptions] = useState(false)

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <Card className="book-card h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="aspect-[3/4] relative mb-3 bg-gray-100 rounded-lg overflow-hidden">
          {book.imageUrl ? (
            <Image
              src={book.imageUrl || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <div className="text-blue-600 text-center p-4">
                <div className="text-lg font-semibold mb-1">No Cover</div>
                <div className="text-sm opacity-75">Available</div>
              </div>
            </div>
          )}
        </div>

        <CardTitle className="text-sm font-semibold text-blue-900 leading-tight">
          {truncateText(book.title, 60)}
        </CardTitle>
        <CardDescription className="text-xs text-gray-600">{truncateText(book.author, 40)}</CardDescription>

        {book.publishedDate && (
          <div className="text-xs text-gray-500">Published: {new Date(book.publishedDate).getFullYear()}</div>
        )}

        {book.pageCount && <div className="text-xs text-gray-500">{book.pageCount} pages</div>}
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col justify-end">
        {book.status && (
          <div className={`status-badge ${statusColors[book.status]} mb-3 w-fit`}>{statusLabels[book.status]}</div>
        )}

        {showAddButton && (
          <div className="space-y-2">
            {!showAddOptions ? (
              <Button
                onClick={() => setShowAddOptions(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add to Shelf
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={() => onAddToShelf?.("want_to_read")}
                  variant="outline"
                  className="w-full text-xs"
                  size="sm"
                >
                  Want to Read
                </Button>
                <Button
                  onClick={() => onAddToShelf?.("currently_reading")}
                  variant="outline"
                  className="w-full text-xs"
                  size="sm"
                >
                  Currently Reading
                </Button>
                <Button onClick={() => onAddToShelf?.("read")} variant="outline" className="w-full text-xs" size="sm">
                  Read
                </Button>
                <Button onClick={() => setShowAddOptions(false)} variant="ghost" className="w-full text-xs" size="sm">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        {showShelfActions && (
          <div className="flex gap-2">
            <Select value={book.status} onValueChange={onStatusChange}>
              <SelectTrigger className="flex-1 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="want_to_read">Want to Read</SelectItem>
                <SelectItem value="currently_reading">Currently Reading</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onRemove} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
