"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import { MessageCircle } from "lucide-react"
import apiService from "../services/api"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        setLoading(true)
        const response = await apiService.getPosts({
          limit: 6,
          sort: "-createdAt", // Get latest posts first
          status: "published", // Only published posts
        })
        setPosts(response.posts || [])
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setError("Failed to load latest posts")
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-1 grid-cols-2 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">This is for Header 1.</h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Write with style. Create with confidence. MindType helps you turn ideas into powerful stories with smart
                AI tools and a supportive creative community.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Get Started
                </Link>
                <Link
                  to="/create-post"
                  className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Create Post
                </Link>
              </div>
            </div>
            <div className="relative">
              <img src="./images/hero.png" alt="Hero illustration" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest posts</h2>
            <button className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading latest posts...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8">{error}</div>
          )}

          {/* Posts Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {posts.length > 0 ? (
                posts.map((post) => {
                  // Handle API data structure
                  const postId = post._id || post.id
                  const authorName =
                    post.author?.firstName && post.author?.lastName
                      ? `${post.author.firstName} ${post.author.lastName}`
                      : post.author?.username || post.author || "Unknown Author"
                  const postDate = post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : post.date || "Unknown date"
                  const postImage = post.image || "/placeholder.svg?height=200&width=300"
                  const postContent = post.excerpt || post.content || "No content available"

                  return (
                    <Link
                      key={postId}
                      to={`/post/${postId}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border group"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={postImage || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            {post.category || "General"}
                          </span>
                          <span className="text-xs text-gray-500">{post.readTime || 1} min read</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">{postContent}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-2">
                            <img
                              src={post.author?.avatar || "/placeholder.svg?height=20&width=20"}
                              alt={authorName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-medium">{authorName}</span>
                          </div>
                          <span>{postDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>❤️ {post.likes?.length || 0}</span>
                            <span>💬 {post.comments?.length || 0}</span>
                            <span>👁️ {post.views || 0}</span>
                          </div>
                          <div className="text-blue-600 text-sm font-medium group-hover:text-blue-800 transition-colors">
                            READ MORE →
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                    <p>Be the first to share your thoughts with the community!</p>
                  </div>
                  <Link
                    to="/create-post"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create your first post
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* View All Posts Link */}
          {!loading && !error && posts.length > 0 && (
            <div className="text-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                View all posts →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Categories</h2>
          <div className="grid sm:grid-cols-2 grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Technology", image: "/placeholder.svg?height=300&width=400&text=Technology" },
              { name: "Design", image: "/placeholder.svg?height=300&width=400&text=Design" },
              { name: "Travel", image: "/placeholder.svg?height=300&width=400&text=Travel" },
              { name: "Lifestyle", image: "/placeholder.svg?height=300&width=400&text=Lifestyle" },
            ].map((category, index) => (
              <Link
                key={index}
                to={`/explore?category=${category.name.toLowerCase()}`}
                className="relative bg-gray-900 rounded-lg overflow-hidden aspect-[4/3] group cursor-pointer"
              >
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Discover amazing {category.name.toLowerCase()} content from our community of writers and creators.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
