"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search } from "lucide-react"

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  // Different navigation for homepage vs other pages
  const isHomePage = location.pathname === "/"

  const homeNavItems = [
    { path: "/", label: "Home" },
    { path: "/explore", label: "Explore" },
    { path: "/categories", label: "Categories" },
    { path: "/contact", label: "Contact us" },
  ]

  const dashboardNavItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/explore", label: "Explore" },
    { path: "/my-posts", label: "My Posts" },
    { path: "/contact", label: "Contact" },
  ]

  const navItems = isHomePage ? homeNavItems : dashboardNavItems

  return (
    <header className="bg-glass shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl text-gray-900">MINDTYPE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className=" flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors ${
                  isActive(item.path) ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder=""
                className="pl-10 pr-4 py-2 w-48 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>

            {/* Create Button */}
            <Link
              to="/create-post"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create
            </Link>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                  <div className="flex items-center px-3 py-2 border-b">
                    <img
                      src="/placeholder.svg?height=24&width=24"
                      alt="Profile"
                      className="w-6 h-6 rounded-full object-cover mr-2"
                    />
                    <span className="text-sm font-medium text-gray-900">Elizabeth Johnson</span>
                  </div>
                  {["Edit Profile", "Display & Accessibility", "Help & Support", "Settings"].map((item) => (
                    <Link
                      key={item}
                      to="/profile"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                  <hr className="my-1" />
                  <button className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
