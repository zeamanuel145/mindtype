"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ImageIcon, X, Save, Eye, AlertCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import apiService from "../services/api"

const CreatePost = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    category: "Technology",
    tags: "",
    excerpt: "",
    status: "published",
    featured: false,
    allowComments: true,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [isPreview, setIsPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (error) setError(null)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setImageFile(file)
    setUploadingImage(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
        setFormData((prev) => ({
          ...prev,
          image: e.target.result, // Store base64 for now
        }))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error processing image:", error)
      setError("Failed to process image")
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    setFormData((prev) => ({
      ...prev,
      image: "",
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setError("Title is required")
      return
    }

    if (!formData.content.trim()) {
      setError("Content is required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Prepare post data
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        image: formData.image || undefined,
        category: formData.category,
        tags: formData.tags.trim(),
        status: formData.status,
        featured: formData.featured,
        allowComments: formData.allowComments,
      }

      console.log("Submitting post data:", postData)

      const response = await apiService.createPost(postData)

      console.log("Post created successfully:", response)

      // Navigate to the created post or my posts
      if (response.post && response.post._id) {
        navigate(`/post/${response.post._id}`)
      } else {
        navigate("/my-posts")
      }
    } catch (error) {
      console.error("Failed to create post:", error)
      setError(error.message || "Failed to create post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!formData.title.trim() && !formData.content.trim()) {
      setError("Please add some content before saving as draft")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const draftData = {
        ...formData,
        status: "draft",
      }

      const response = await apiService.createPost(draftData)
      console.log("Draft saved:", response)
      navigate("/my-posts")
    } catch (error) {
      console.error("Failed to save draft:", error)
      setError(error.message || "Failed to save draft")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl text-gray-900">MINDTYPE</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </button>
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? "Edit" : "Preview"}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              {!isPreview ? (
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Post Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter an engaging title for your post..."
                      className="w-full text-black px-4 py-4 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Excerpt <span className="text-gray-500 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Write a brief description of your post..."
                      rows={3}
                      className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Featured Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-gray-50">
                      {imagePreview ? (
                        <div className="relative p-4">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-6 right-6 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {uploadingImage && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                              <div className="text-white text-sm">Processing image...</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-12 text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <label className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-500 font-medium">Upload an image</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                            />
                          </label>
                          <p className="text-gray-500 text-sm mt-2">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Content</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Tell your story... Use markdown for formatting!"
                      rows={16}
                      className="w-full text-black px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-lg leading-relaxed"
                      required
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      Tip: You can use **bold**, *italic*, and other markdown formatting
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        "CREATE POST"
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Preview Mode */
                <div className="p-8">
                  <div className="mb-8">
                    {imagePreview && (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg mb-6"
                      />
                    )}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title || "Your Post Title"}</h1>
                    {formData.excerpt && (
                      <p className="text-xl text-gray-600 mb-6 leading-relaxed">{formData.excerpt}</p>
                    )}
                    <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <img
                          src={user?.avatar || "/placeholder.svg?height=24&width=24"}
                          alt={user?.firstName}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>
                          {user?.firstName} {user?.lastName}
                        </span>
                      </div>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {formData.category}
                      </span>
                    </div>
                    <div className="prose max-w-none">
                      <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                        {formData.content || "Your post content will appear here..."}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Settings</h3>
              <div className="space-y-4">
                <div className="">
                  <label className="block  text-black text-sm font-medium  mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <div className="text-black ">
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Travel">Travel</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Business">Business</option>
                    <option value="Health">Health</option>
                    <option value="Food">Food</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Sports">Sports</option>
                    <option value="Entertainment">Entertainment</option>
                    </div>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="javascript, react, tutorial"
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <div className="mt-1 text-xs text-gray-500">Separate tags with commas</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Publishing Options */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Options</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowComments"
                    checked={formData.allowComments}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow comments</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured post</span>
                </label>
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Author</h3>
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={user?.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm text-gray-500">@{user?.username}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
