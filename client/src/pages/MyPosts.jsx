"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Filter } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import apiService from "../services/api"
import PostCard from "../components/PostCard"

const MyPosts = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all") // all, published, draft
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user?._id) return

      try {
        setLoading(true)
        const response = await apiService.getUserPosts(user._id, {
          ...(filter !== "all" && { status: filter }),
        })
        setPosts(response.posts || [])
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        setError("Failed to load your posts")
      } finally {
        setLoading(false)
      }
    }

    fetchMyPosts()
  }, [user, filter])

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      await apiService.deletePost(postId)
      setPosts(posts.filter((post) => post._id !== postId))
    } catch (error) {
      console.error("Failed to delete post:", error)
      alert("Failed to delete post. Please try again.")
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
              <p className="text-gray-600">Manage and organize your blog posts</p>
            </div>
            <Link
              to="/create-post"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </Link>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Posts</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>}

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} showActions={true} onDelete={handleDeletePost} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? "No posts found" : filter === "draft" ? "No drafts yet" : "No posts yet"}
              </h3>
              <p className="mb-6">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : filter === "draft"
                    ? "Your draft posts will appear here"
                    : "Start sharing your thoughts with the world!"}
              </p>
            </div>
            {!searchTerm && (
              <Link
                to="/create-post"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create your first post
              </Link>
            )}
          </div>
        )}

        {/* Stats */}
        {posts.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
                <div className="text-sm text-gray-500">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {posts.filter((p) => p.status === "published").length}
                </div>
                <div className="text-sm text-gray-500">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {posts.filter((p) => p.status === "draft").length}
                </div>
                <div className="text-sm text-gray-500">Drafts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {posts.reduce((total, post) => total + (post.views || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Views</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPosts
