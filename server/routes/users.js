const express = require("express")
const User = require("../models/User")
const Post = require("../models/Post")
const auth = require("../middleware/auth")

const router = express.Router()

// Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("posts", "title createdAt status views likeCount")
      .select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get user stats
    const postStats = await Post.aggregate([
      { $match: { author: user._id, status: "published" } },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: { $size: "$likes" } },
        },
      },
    ])

    const stats = postStats[0] || { totalPosts: 0, totalViews: 0, totalLikes: 0 }

    res.json({
      user: {
        ...user.toJSON(),
        stats: {
          posts: stats.totalPosts,
          views: stats.totalViews,
          likes: stats.totalLikes,
          followers: user.followers.length,
          following: user.following.length,
        },
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { firstName, lastName, bio, avatar } = req.body

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        bio,
        avatar,
      },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "Profile updated successfully",
      user,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    })
  }
})

// Follow/Unfollow user
router.post("/:id/follow", auth, async (req, res) => {
  try {
    const targetUserId = req.params.id
    const currentUserId = req.userId

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" })
    }

    const targetUser = await User.findById(targetUserId)
    const currentUser = await User.findById(currentUserId)

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const isFollowing = currentUser.following.includes(targetUserId)

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUserId)
      targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId)
    } else {
      // Follow
      currentUser.following.push(targetUserId)
      targetUser.followers.push(currentUserId)
    }

    await currentUser.save()
    await targetUser.save()

    res.json({
      message: isFollowing ? "User unfollowed" : "User followed",
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
    })
  } catch (error) {
    console.error("Follow/unfollow error:", error)
    res.status(500).json({
      message: "Failed to follow/unfollow user",
      error: error.message,
    })
  }
})

// Get user's followers
router.get("/:id/followers", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "username firstName lastName avatar bio")
      .select("followers")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ followers: user.followers })
  } catch (error) {
    console.error("Get followers error:", error)
    res.status(500).json({
      message: "Failed to fetch followers",
      error: error.message,
    })
  }
})

// Get user's following
router.get("/:id/following", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("following", "username firstName lastName avatar bio")
      .select("following")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ following: user.following })
  } catch (error) {
    console.error("Get following error:", error)
    res.status(500).json({
      message: "Failed to fetch following",
      error: error.message,
    })
  }
})

module.exports = router
