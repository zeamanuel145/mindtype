import { Link } from "react-router-dom"
import { MessageCircle } from "lucide-react"

const Dashboard = ({ posts }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to your Dashboard, Robert</h1>
              <p className="text-gray-600 leading-relaxed">
                Your experiences, ideas, and insights matter more than you think. Whether it's a quick tip you learned
                this week, a story that inspired you, or a step-by-step guide others could learn from—someone out there
                is looking for exactly what you have to say.
              </p>
            </div>
            <div className="ml-8 flex-shrink-0">
              <Link
                to="/create-post"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Create a post
              </Link>
            </div>
          </div>
        </div>

        {/* For you page */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">For you page</h2>
            <button className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts
              .concat(posts, posts)
              .slice(0, 9)
              .map((post, index) => (
                <Link
                  key={index}
                  to={`/post/${post.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border"
                >
                  <img
                    src={post.image || "/placeholder.svg?height=200&width=300"}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="text-blue-600 text-sm font-medium">READ MORE →</div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
