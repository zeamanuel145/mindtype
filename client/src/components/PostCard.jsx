"use client"

import { Link } from "react-router-dom"
import { ArrowRight, Edit, Trash2, Heart, MessageCircle, Share, MoreHorizontal, Eye } from "lucide-react"
import { useState } from "react"

const PostCard = ({ post, showActions = false, onEdit, onDelete, variant = "default" }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  // Handle API data structure
  const postId = post._id || post.id
  const authorName =
    post.author?.firstName && post.author?.lastName
      ? `${post.author.firstName} ${post.author.lastName}`
      : post.author?.username || post.author || "Unknown Author"
  const authorAvatar = post.author?.avatar || "/placeholder.svg?height=40&width=40"
  const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : post.date
  const postImage = post.image || "/placeholder.svg?height=400&width=600"
  const likeCount = post.likeCount || post.likes?.length || 0
  const commentCount = post.commentCount || post.comments?.length || 0

  if (variant === "featured") {
    return (
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
        <div className="aspect-[16/10] overflow-hidden relative">
          <Link to={`/post/${postId}`}>
            <img
              src={postImage || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              Featured
            </span>
          </div>
          {showActions && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <Link
                to={`/edit-post/${postId}`}
                className="p-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-all shadow-lg"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onDelete && onDelete(postId)}
                className="p-2.5 bg-white/90 backdrop-blur-sm text-red-600 rounded-full hover:bg-white transition-all shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="p-6 lg:p-8">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={authorAvatar || "/placeholder.svg"}
              alt={authorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">{authorName}</p>
              <p className="text-xs text-gray-500">{postDate}</p>
            </div>
          </div>

          <Link to={`/post/${postId}`}>
            <h3 className="font-bold text-xl lg:text-2xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h3>
          </Link>

          <p className="text-gray-600 mb-6 line-clamp-3 text-base lg:text-lg leading-relaxed">
            {post.excerpt || post.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all ${
                  isLiked ? "text-red-500 bg-red-50" : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>
              <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{commentCount}</span>
              </button>
              <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 transition-all">
                <Share className="w-5 h-5" />
              </button>
            </div>
            <Link
              to={`/post/${postId}`}
              className="group flex items-center text-blue-600 hover:text-blue-800 transition-colors font-semibold"
            >
              Read more
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-video overflow-hidden relative">
        <Link to={`/post/${postId}`}>
          <img
            src={postImage || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
            {post.category}
          </span>
        </div>
        {showActions && (
          <div className="absolute top-3 right-3">
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-all shadow-sm"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10">
                  <Link
                    to={`/edit-post/${postId}`}
                    className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      onDelete && onDelete(postId)
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={authorAvatar || "/placeholder.svg"}
            alt={authorName}
            className="w-6 h-6 rounded-full object-cover ring-2 ring-gray-200"
          />
          <div>
            <p className="text-xs font-semibold text-gray-900">{authorName}</p>
            <p className="text-xs text-gray-500">{postDate}</p>
          </div>
        </div>

        <Link to={`/post/${postId}`}>
          <h3 className="font-bold text-base lg:text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{post.excerpt || post.content}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all ${
                isLiked ? "text-red-500 bg-red-50" : "text-gray-500 hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{likeCount}</span>
            </button>
            <button className="flex items-center space-x-1 px-2 py-1 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{commentCount}</span>
            </button>
            <button className="flex items-center space-x-1 px-2 py-1 rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 transition-all">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-medium">{post.views || 0}</span>
            </button>
          </div>
          <Link
            to={`/post/${postId}`}
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-semibold"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PostCard
