const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../server/models/User")
const Post = require("../server/models/Post")
require("dotenv").config()

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mindtype")
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Post.deleteMany({})
    console.log("Cleared existing data")

    // Create sample users
    const users = [
      {
        username: "elizabeth_johnson",
        email: "elizabeth@example.com",
        password: "password123",
        firstName: "Elizabeth",
        lastName: "Johnson",
        bio: "Content creator and tech enthusiast. Love writing about design and technology.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        username: "john_doe",
        email: "john@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        bio: "Travel blogger and photographer. Exploring the world one story at a time.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        username: "jane_smith",
        email: "jane@example.com",
        password: "password123",
        firstName: "Jane",
        lastName: "Smith",
        bio: "Business consultant and lifestyle writer. Sharing insights on productivity and success.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ]

    const createdUsers = await User.create(users)
    console.log("Created sample users")

    // Create sample posts
    const posts = [
      {
        title: "Getting Started with Modern Web Development",
        content:
          "Web development has evolved significantly over the past few years. In this comprehensive guide, we'll explore the latest trends, tools, and best practices that every developer should know. From React and Vue.js to Node.js and MongoDB, we'll cover the essential technologies that are shaping the future of web development. Whether you're a beginner looking to start your journey or an experienced developer wanting to stay updated, this post will provide valuable insights and practical tips to enhance your skills.",
        excerpt: "A comprehensive guide to modern web development trends, tools, and best practices.",
        image: "/placeholder.svg?height=400&width=600",
        category: "Technology",
        tags: ["web development", "javascript", "react", "nodejs"],
        author: createdUsers[0]._id,
        status: "published",
        featured: true,
      },
      {
        title: "The Art of Minimalist Design",
        content:
          "Minimalism in design is more than just a trend—it's a philosophy that emphasizes simplicity, functionality, and elegance. In this post, we'll explore the principles of minimalist design and how to apply them effectively in your projects. We'll discuss color theory, typography, white space, and the importance of removing unnecessary elements. Learn how to create designs that are not only visually appealing but also highly functional and user-friendly.",
        excerpt: "Discover the principles of minimalist design and how to create elegant, functional interfaces.",
        image: "/placeholder.svg?height=400&width=600",
        category: "Design",
        tags: ["design", "minimalism", "ui", "ux"],
        author: createdUsers[0]._id,
        status: "published",
      },
      {
        title: "Hidden Gems: 10 Underrated Travel Destinations",
        content:
          "While popular tourist destinations have their charm, there's something magical about discovering hidden gems that few people know about. In this post, I'll share 10 underrated travel destinations that offer incredible experiences without the crowds. From secluded beaches in Southeast Asia to charming mountain villages in Europe, these places will inspire your next adventure. Each destination includes practical travel tips, best times to visit, and must-see attractions.",
        excerpt: "Explore 10 amazing travel destinations that are off the beaten path.",
        image: "/placeholder.svg?height=400&width=600",
        category: "Travel",
        tags: ["travel", "destinations", "adventure", "hidden gems"],
        author: createdUsers[1]._id,
        status: "published",
      },
      {
        title: "Building Healthy Habits That Stick",
        content:
          "Creating lasting change in your life starts with building healthy habits. But why do some habits stick while others fade away? In this post, we'll explore the science behind habit formation and provide practical strategies for building habits that last. We'll cover the habit loop, the importance of starting small, and how to overcome common obstacles. Whether you want to exercise more, eat better, or develop a reading habit, these proven techniques will help you succeed.",
        excerpt: "Learn the science behind habit formation and practical strategies for lasting change.",
        image: "/placeholder.svg?height=400&width=600",
        category: "Lifestyle",
        tags: ["habits", "health", "productivity", "self-improvement"],
        author: createdUsers[2]._id,
        status: "published",
      },
      {
        title: "The Future of Remote Work",
        content:
          "Remote work has transformed from a perk to a necessity, and it's here to stay. In this comprehensive analysis, we'll examine the current state of remote work and predict future trends. We'll discuss the benefits and challenges, the impact on company culture, and the tools that make remote collaboration possible. Learn how businesses are adapting their strategies and what this means for the future of work.",
        excerpt: "An in-depth look at remote work trends and what the future holds.",
        image: "/placeholder.svg?height=400&width=600",
        category: "Business",
        tags: ["remote work", "business", "future", "productivity"],
        author: createdUsers[2]._id,
        status: "published",
      },
    ]

    const createdPosts = await Post.create(posts)
    console.log("Created sample posts")

    // Update users with their posts
    for (let i = 0; i < createdUsers.length; i++) {
      const userPosts = createdPosts.filter((post) => post.author.toString() === createdUsers[i]._id.toString())
      await User.findByIdAndUpdate(createdUsers[i]._id, {
        posts: userPosts.map((post) => post._id),
      })
    }

    console.log("Database seeded successfully!")
    console.log(`Created ${createdUsers.length} users and ${createdPosts.length} posts`)

    // Display login credentials
    console.log("\n--- Sample Login Credentials ---")
    users.forEach((user) => {
      console.log(`Email: ${user.email} | Password: ${user.password}`)
    })
  } catch (error) {
    console.error("Seeding error:", error)
  } finally {
    await mongoose.connection.close()
    console.log("Database connection closed")
  }
}

seedData()
