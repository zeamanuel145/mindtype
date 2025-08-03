"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ImageIcon, X, Save, Eye, Menu } from "lucide-react"

const CreatePost = ({ onAddPost }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    category: "Technology",
    tags: "",
    excerpt: "",
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [isPreview, setIsPreview] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
        setFormData((prev) => ({
          ...prev,
          image: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title && formData.content) {
      onAddPost({
        ...formData,
        image: formData.image || "/placeholder.svg?height=400&width=600",
      })
      navigate("/my-posts")
    }
  }

  const handleSaveDraft = () => {
    // Save as draft logic
    console.log("Saving as draft...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
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
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
            {/* <button className="p-2 text-gray-600 hover:text-gray-900">
              <Menu className="w-6 h-6" />
            </button> */}
          </div>
        </div>

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
                      className="w-full px-4 py-4 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Excerpt</label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Write a brief description of your post..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Featured Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors bg-gray-50">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="max-w-full h-32 object-cover rounded-lg mx-auto"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null)
                              setFormData((prev) => ({ ...prev, image: "" }))
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <label className="cursor-pointer">
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                          </label>
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
                      placeholder="Tell your story..."
                      rows={16}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-lg leading-relaxed"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="w-full bg-gray-900 text-white py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium text-lg"
                    >
                      CREATE POST
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
                        className="w-full h-32 object-cover rounded-lg mb-6"
                      />
                    )}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title || "Your Post Title"}</h1>
                    {formData.excerpt && <p className="text-xl text-gray-600 mb-6">{formData.excerpt}</p>}
                    <div className="prose max-w-none">
                      <p className="text-lg leading-relaxed text-gray-700">
                        {formData.content || "Your post content will appear here..."}
                      </p>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Travel">Travel</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Add tags separated by commas"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Publishing Options */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Allow comments</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Featured post</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Send notification</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
