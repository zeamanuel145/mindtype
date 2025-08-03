import { Link } from "react-router-dom"
import { MessageCircle } from "lucide-react"

const WelcomeSection = ({ userName = "Robert", showCreateButton = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to your Dashboard, {userName}</h1>
          <p className="text-gray-600 max-w-2xl">
            Your experiences, ideas, and insights matter more than you think. Whether it's a quick tip you learned this
            week, a story that inspired you, or a step-by-step guide others could learn from—someone out there is
            looking for exactly what you have to say.
          </p>
        </div>
        {showCreateButton && (
          <div className="flex items-center space-x-4">
            <Link
              to="/create-post"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              Create a post
            </Link>
            <button className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default WelcomeSection
