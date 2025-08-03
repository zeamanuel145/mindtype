import { Link } from "react-router-dom"

const MyPosts = ({ posts, onDeletePost }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
          <p className="text-gray-600 mb-6">Start your blog post now — your voice belongs here.</p>

          <Link
            to="/create-post"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Create a post
          </Link>
        </div>

        {/* Posts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">My Posts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
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
                  <div>
                    <Link to={`/edit-post/${post.id}`} className="text-blue-600 text-sm font-medium">
                      READ MORE →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPosts
