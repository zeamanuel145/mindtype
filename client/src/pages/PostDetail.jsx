"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Trash2, Share, Heart, MessageCircle, Eye, Send } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import apiService from "../services/api"

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState([])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await apiService.getPost(id)
        const postData = response.post

        setPost(postData)
        setLikeCount(postData.likes?.length || 0)

        // Check if current user has liked this post
        if (user && postData.likes) {
          const userLike = postData.likes.find((like) => like.user === user._id)
          setIsLiked(!!userLike)
        }

        // Fetch related posts
        if (postData.category) {
          try {
            const relatedResponse = await apiService.getPosts({
              category: postData.category,
              limit: 3,
            })
            const filtered = relatedResponse.posts?.filter((p) => p._id !== postData._id) || []
            setRelatedPosts(filtered.slice(0, 3))
          } catch (error) {
            console.error("Failed to fetch related posts:", error)
          }
        }
      } catch (error) {
        console.error("Failed to fetch post:", error)
        setError(error.message || "Failed to load post")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id, user])

  const handleLike = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    try {
      const response = await apiService.likePost(id)
      setIsLiked(response.isLiked)
      setLikeCount(response.likeCount)
    } catch (error) {
      console.error("Failed to like post:", error)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()

    if (!user) {
      navigate("/login")
      return
    }

    if (!newComment.trim()) return

    setSubmittingComment(true)
    try {
      const response = await apiService.addComment(id, newComment.trim())

      // Add the new comment to the post
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...(prevPost.comments || []), response.comment],
      }))

      setNewComment("")
    } catch (error) {
      console.error("Failed to add comment:", error)
      alert("Failed to add comment. Please try again.")
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return
    }

    try {
      await apiService.deletePost(id)
      navigate("/my-posts")
    } catch (error) {
      console.error("Failed to delete post:", error)
      alert("Failed to delete post. Please try again.")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.content.substring(0, 150),
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Post not found"}</h2>
          <p className="text-gray-600 mb-6">
            {error ? "There was an error loading this post." : "The post you're looking for doesn't exist."}
          </p>
          <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const isAuthor = user && post.author && (post.author._id === user._id || post.author === user._id)
  const authorName =
    post.author?.firstName && post.author?.lastName
      ? `${post.author.firstName} ${post.author.lastName}`
      : post.author?.username || "Unknown Author"
  const authorAvatar = post.author?.avatar || "/placeholder.svg?height=40&width=40"
  const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown date"

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Post Content */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Post Image */}
          {post.image && (
            <div className="aspect-video w-full">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Post Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={authorAvatar || "/placeholder.svg"}
                  alt={authorName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                />
                <div>
                  <p className="font-semibold text-gray-900">{authorName}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{postDate}</span>
                    <span>•</span>
                    <span>{post.readTime || 1} min read</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>

              {isAuthor && (
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleDeletePost}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

            {post.excerpt && <p className="text-xl text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>}

            <div className="flex items-center space-x-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</div>
            </div>
          </div>

          {/* Post Actions */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked ? "text-red-600 hover:text-red-700" : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  <span className="font-medium">{likeCount}</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{post.comments?.length || 0}</span>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <Share className="w-5 h-5" />
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        {post.allowComments && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Comments ({post.comments?.length || 0})</h3>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex space-x-3">
                  <img
                    src={user.avatar || "/placeholder.svg?height=40&width=40"}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || submittingComment}
                        className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {submittingComment ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Post Comment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-3">Please sign in to leave a comment</p>
                <Link
                  to="/login"
                  className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-3">
                    <img
                      src={comment.user?.avatar || "/placeholder.svg?height=32&width=32"}
                      alt={comment.user?.firstName || "User"}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="bg-glass rounded-lg p-3">
                        <p className="font-semibold text-sm text-gray-900 mb-1">
                          {comment.user?.firstName && comment.user?.lastName
                            ? `${comment.user.firstName} ${comment.user.lastName}`
                            : comment.user?.username || "Anonymous"}
                        </p>
                        <p className="text-black text-sm leading-relaxed">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Just now"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost._id}
                  to={`/post/${relatedPost._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={relatedPost.image || "/placeholder.svg?height=200&width=300"}
                    alt={relatedPost.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">{relatedPost.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {relatedPost.excerpt || relatedPost.content.substring(0, 100)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {relatedPost.createdAt ? new Date(relatedPost.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostDetail
