import { Link, useLocation } from "react-router-dom"
import { Home, Compass, BookOpen, User, PlusCircle, TrendingUp, Settings } from "lucide-react"

const Sidebar = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: BookOpen, label: "My Posts", path: "/my-posts" },
    { icon: TrendingUp, label: "Dashboard", path: "/dashboard" },
    { icon: User, label: "Profile", path: "/profile" },
  ]

  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <Link
          to="/create-post"
          className="flex items-center justify-center w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium mb-8"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Post
        </Link>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-2">
            {["Technology", "Design", "Travel", "Lifestyle", "Business"].map((category) => (
              <Link
                key={category}
                to={`/explore?category=${category.toLowerCase()}`}
                className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link
            to="/settings"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
