"use client"

import { Link, useLocation } from "react-router-dom"
import { X, Home, BookOpen, PenTool, User, FileText, Mail, LogIn, UserPlus } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useSidebar } from "../context/SidebarContext"

const Sidebar = () => {
  const { isAuthenticated, user } = useAuth()
  const { isOpen, closeSidebar } = useSidebar()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: Home,
      public: true,
    },
    {
      name: "All Posts",
      path: "/posts",
      icon: BookOpen,
      public: true,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: User,
      protected: true,
    },
    {
      name: "Create Post",
      path: "/create-post",
      icon: PenTool,
      protected: true,
    },
    {
      name: "My Posts",
      path: "/my-posts",
      icon: FileText,
      protected: true,
    },
    {
      name: "Contact",
      path: "/contact",
      icon: Mail,
      public: true,
    },
  ]

  const authItems = [
    {
      name: "Login",
      path: "/login",
      icon: LogIn,
    },
    {
      name: "Sign Up",
      path: "/signup",
      icon: UserPlus,
    },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeSidebar} />}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" onClick={closeSidebar} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">MindType</span>
          </Link>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        {isAuthenticated && user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar || "/placeholder.svg?height=40&width=40"}
                alt={user.firstName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              // Show public items to everyone, protected items only to authenticated users
              if (item.protected && !isAuthenticated) return null

              const Icon = item.icon
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Auth Links for non-authenticated users */}
          {!isAuthenticated && (
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <ul className="space-y-2">
                {authItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={closeSidebar}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">© 2024 MindType. All rights reserved.</p>
        </div>
      </div>
    </>
  )
}

export default Sidebar
