const express = require("express")
const Post = require("../models/Post")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all posts with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, author, status = "published", search, sort = "-createdAt" } = req.query

    // Build query
    const query = { status }

    if (category) query.category = category
    if (author) query.author = author
    if (search) {
      query.$text = { $search: search }
    }

    // Execute query with pagination
    const posts = await Post.find(query)
      .populate("author", "username firstName lastName avatar")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    // Get total count for pagination
    const total = await Post.countDocuments(query)

    res.json({
      posts,
      pagination: {
        current: Number.parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get posts error:", error)
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    })
  }
})

// Get single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username firstName lastName avatar bio")
      .populate("comments.user", "username firstName lastName avatar")

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Increment view count
    post.views += 1
    await post.save()

    res.json({ post })
  } catch (error) {
    console.error("Get post error:", error)
    res.status(500).json({
      message: "Failed to fetch post",
      error: error.message,
    })
  }
})

// Create new post
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      image,
      category,
      tags,
      status = "published",
      featured = false,
      allowComments = true,
    } = req.body

    const post = new Post({
      title,
      content,
      excerpt,
      image,
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      author: req.userId,
      status,
      featured,
      allowComments,
    })

    await post.save()

    // Add post to user's posts array
    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: post._id },
    })

    // Populate author info
    await post.populate("author", "username firstName lastName avatar")

    res.status(201).json({
      message: "Post created successfully",
      post,
    })
  } catch (error) {
    console.error("Create post error:", error)
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    })
  }
})

// Update post
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is the author
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this post" })
    }

    const { title, content, excerpt, image, category, tags, status, featured, allowComments } = req.body

    // Update fields
    if (title !== undefined) post.title = title
    if (content !== undefined) post.content = content
    if (excerpt !== undefined) post.excerpt = excerpt
    if (image !== undefined) post.image = image
    if (category !== undefined) post.category = category
    if (tags !== undefined) post.tags = tags.split(",").map((tag) => tag.trim())
    if (status !== undefined) post.status = status
    if (featured !== undefined) post.featured = featured
    if (allowComments !== undefined) post.allowComments = allowComments

    await post.save()
    await post.populate("author", "username firstName lastName avatar")

    res.json({
      message: "Post updated successfully",
      post,
    })
  } catch (error) {
    console.error("Update post error:", error)
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    })
  }
})

// Delete post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is the author
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this post" })
    }

    await Post.findByIdAndDelete(req.params.id)

    // Remove post from user's posts array
    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    })

    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Delete post error:", error)
    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    })
  }
})

// Like/Unlike post
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const existingLike = post.likes.find((like) => like.user.toString() === req.userId)

    if (existingLike) {
      // Unlike
      post.likes = post.likes.filter((like) => like.user.toString() !== req.userId)
    } else {
      // Like
      post.likes.push({ user: req.userId })
    }

    await post.save()

    res.json({
      message: existingLike ? "Post unliked" : "Post liked",
      likeCount: post.likes.length,
      isLiked: !existingLike,
    })
  } catch (error) {
    console.error("Like post error:", error)
    res.status(500).json({
      message: "Failed to like/unlike post",
      error: error.message,
    })
  }
})

// Add comment to post
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Comment content is required" })
    }

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    if (!post.allowComments) {
      return res.status(403).json({ message: "Comments are not allowed on this post" })
    }

    post.comments.push({
      user: req.userId,
      content: content.trim(),
    })

    await post.save()
    await post.populate("comments.user", "username firstName lastName avatar")

    const newComment = post.comments[post.comments.length - 1]

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    })
  } catch (error) {
    console.error("Add comment error:", error)
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    })
  }
})

// Get user's posts
router.get("/user/:userId", async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const query = { author: req.params.userId }

    if (status) query.status = status

    const posts = await Post.find(query)
      .populate("author", "username firstName lastName avatar")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Post.countDocuments(query)

    res.json({
      posts,
      pagination: {
        current: Number.parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get user posts error:", error)
    res.status(500).json({
      message: "Failed to fetch user posts",
      error: error.message,
    })
  }
})

module.exports = router
