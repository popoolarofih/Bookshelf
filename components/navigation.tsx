"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Search, Library } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/search",
      label: "Search Books",
      icon: Search,
    },
    {
      href: "/shelf",
      label: "My Shelf",
      icon: Library,
    },
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-900">BookShelf</span>
          </Link>

          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium",
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
