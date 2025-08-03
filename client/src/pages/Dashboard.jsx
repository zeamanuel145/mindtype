"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MessageCircle, Plus } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import apiService from "../services/api"
import PostCard from "../components/PostCard"

const Dashboard = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await apiService.getPosts({
          limit: 12,
          sort: "-createdAt",
        })
        setPosts(response.posts || [])
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setError("Failed to load posts")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to your Dashboard, {user?.firstName || "there"}!
              </h1>
              <p className="text-gray-600 leading-relaxed">
                Your experiences, ideas, and insights matter more than you think. Whether it's a quick tip you learned
                this week, a story that inspired you, or a step-by-step guide others could learn from—someone out there
                is looking for exactly what you have to say.
              </p>
            </div>
            <div className="ml-8 flex-shrink-0 flex items-center space-x-3">
              <Link
                to="/create-post"
                className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create a post
              </Link>
              <button className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* For you page */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">For you</h2>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {posts.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p>Be the first to share your thoughts with the community!</p>
              </div>
              <Link
                to="/create-post"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create your first post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
