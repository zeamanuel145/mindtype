const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      minlength: [10, "Content must be at least 10 characters long"],
    },
    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Technology",
        "Design",
        "Travel",
        "Lifestyle",
        "Business",
        "Health",
        "Food",
        "Fashion",
        "Sports",
        "Entertainment",
      ],
      default: "Technology",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: [1000, "Comment cannot exceed 1000 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    readTime: {
      type: Number, // in minutes
      default: 1,
    },
  },
  {
    timestamps: true,
  },
)

// Calculate read time based on content length
postSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    const wordsPerMinute = 200
    const wordCount = this.content.split(/\s+/).length
    this.readTime = Math.ceil(wordCount / wordsPerMinute) || 1
  }

  // Auto-generate excerpt if not provided
  if (this.isModified("content") && !this.excerpt) {
    this.excerpt = this.content.substring(0, 150) + (this.content.length > 150 ? "..." : "")
  }

  next()
})

// Index for better search performance
postSchema.index({ title: "text", content: "text", tags: "text" })
postSchema.index({ category: 1, status: 1, createdAt: -1 })
postSchema.index({ author: 1, createdAt: -1 })

// Virtual for like count
postSchema.virtual("likeCount").get(function () {
  return this.likes.length
})

// Virtual for comment count
postSchema.virtual("commentCount").get(function () {
  return this.comments.length
})

// Ensure virtuals are included in JSON
postSchema.set("toJSON", { virtuals: true })

module.exports = mongoose.model("Post", postSchema)
