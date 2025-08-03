const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../server/models/User")
const Post = require("../server/models/Post")
require("dotenv").config()

const seedData = async () => {
  try {
    // Connect to MongoDB Atlas
    console.log("Connecting to MongoDB Atlas...")
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    console.log("✅ Connected to MongoDB Atlas")
    console.log(`Database: ${mongoose.connection.name}`)
    console.log(`Host: ${mongoose.connection.host}`)

    // Check if data already exists
    const existingUsers = await User.countDocuments()
    const existingPosts = await Post.countDocuments()

    if (existingUsers > 0 || existingPosts > 0) {
      console.log(`Found ${existingUsers} users and ${existingPosts} posts`)
      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      const answer = await new Promise((resolve) => {
        readline.question("Do you want to clear existing data and reseed? (y/N): ", resolve)
      })
      readline.close()

      if (answer.toLowerCase() !== "y") {
        console.log("Seeding cancelled")
        return
      }
    }

    // Clear existing data
    console.log("🧹 Clearing existing data...")
    await User.deleteMany({})
    await Post.deleteMany({})
    console.log("✅ Cleared existing data")

    // Create sample users
    console.log("👥 Creating sample users...")
    const users = [
      {
        username: "elizabeth_johnson",
        email: "elizabeth@mindtype.com",
        password: "password123",
        firstName: "Elizabeth",
        lastName: "Johnson",
        bio: "Content creator and tech enthusiast. Love writing about design and technology trends.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        username: "john_doe",
        email: "john@mindtype.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        bio: "Travel blogger and photographer. Exploring the world one story at a time.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        username: "jane_smith",
        email: "jane@mindtype.com",
        password: "password123",
        firstName: "Jane",
        lastName: "Smith",
        bio: "Business consultant and lifestyle writer. Sharing insights on productivity and success.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        username: "alex_chen",
        email: "alex@mindtype.com",
        password: "password123",
        firstName: "Alex",
        lastName: "Chen",
        bio: "Full-stack developer and open source contributor. Passionate about clean code and user experience.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
      {
        username: "sarah_wilson",
        email: "sarah@mindtype.com",
        password: "password123",
        firstName: "Sarah",
        lastName: "Wilson",
        bio: "Digital marketing expert and content strategist. Helping brands tell their stories online.",
        avatar: "/placeholder.svg?height=100&width=100",
      },
    ]

    const createdUsers = await User.create(users)
    console.log(`✅ Created ${createdUsers.length} sample users`)

    // Create sample posts
    console.log("📝 Creating sample posts...")
    const posts = [
      {
        title: "Getting Started with Modern Web Development in 2024",
        content: `Web development has evolved significantly over the past few years, and 2024 brings exciting new possibilities. In this comprehensive guide, we'll explore the latest trends, tools, and best practices that every developer should know.

## The Current Landscape

The web development ecosystem is more vibrant than ever. From React and Vue.js to Node.js and MongoDB, we'll cover the essential technologies that are shaping the future of web development.

### Frontend Technologies
- **React 18**: With concurrent features and improved performance
- **Vue 3**: Composition API and better TypeScript support  
- **Svelte**: The compile-time framework gaining momentum
- **Next.js 14**: Full-stack React with App Router

### Backend Technologies
- **Node.js**: Still the king of JavaScript backends
- **Deno**: The secure runtime for JavaScript and TypeScript
- **Bun**: The fast all-in-one JavaScript runtime

### Database Solutions
- **MongoDB**: Flexible document database
- **PostgreSQL**: Robust relational database
- **Supabase**: Open source Firebase alternative

Whether you're a beginner looking to start your journey or an experienced developer wanting to stay updated, this post will provide valuable insights and practical tips to enhance your skills.

## Getting Started

The key to modern web development is understanding the ecosystem and choosing the right tools for your project. Start with the fundamentals, then gradually explore advanced concepts.`,
        excerpt: "A comprehensive guide to modern web development trends, tools, and best practices for 2024.",
        image: "/placeholder.svg?height=400&width=600&text=Web+Development+2024",
        category: "Technology",
        tags: ["web development", "javascript", "react", "nodejs", "2024"],
        author: createdUsers[0]._id,
        status: "published",
        featured: true,
        allowComments: true,
      },
      {
        title: "The Art of Minimalist Design: Less is More",
        content: `Minimalism in design is more than just a trend—it's a philosophy that emphasizes simplicity, functionality, and elegance. In this post, we'll explore the principles of minimalist design and how to apply them effectively in your projects.

## Core Principles

### 1. Simplicity
Remove unnecessary elements and focus on what truly matters. Every element should serve a purpose.

### 2. White Space
Embrace white space as a design element. It helps create breathing room and draws attention to important content.

### 3. Typography
Choose clean, readable fonts. Typography should enhance the message, not distract from it.

### 4. Color Theory
Use a limited color palette. Often, a monochromatic or analogous color scheme works best.

## Practical Applications

We'll discuss how to apply these principles in:
- Web design
- Mobile app interfaces
- Print materials
- Brand identity

Learn how to create designs that are not only visually appealing but also highly functional and user-friendly. The goal is to communicate more with less.`,
        excerpt: "Discover the principles of minimalist design and how to create elegant, functional interfaces.",
        image: "/placeholder.svg?height=400&width=600&text=Minimalist+Design",
        category: "Design",
        tags: ["design", "minimalism", "ui", "ux", "principles"],
        author: createdUsers[0]._id,
        status: "published",
      },
      {
        title: "Hidden Gems: 10 Underrated Travel Destinations You Must Visit",
        content: `While popular tourist destinations have their charm, there's something magical about discovering hidden gems that few people know about. In this post, I'll share 10 underrated travel destinations that offer incredible experiences without the crowds.

## Why Choose Hidden Gems?

- **Authentic experiences**: Connect with local culture
- **Better value**: More affordable than popular destinations  
- **Unique stories**: Create memories that few others have
- **Less crowded**: Enjoy peaceful exploration

## The Destinations

### 1. Faroe Islands, Denmark
Dramatic landscapes, grass-roof houses, and Nordic culture.

### 2. Socotra Island, Yemen  
Alien-like landscapes with unique flora and fauna.

### 3. Svaneti, Georgia
Medieval towers and pristine mountain landscapes.

### 4. Raja Ampat, Indonesia
World's richest marine biodiversity for diving enthusiasts.

### 5. Lofoten Islands, Norway
Arctic beauty with fishing villages and Northern Lights.

Each destination includes:
- **Best time to visit**
- **How to get there**
- **Where to stay**
- **Must-see attractions**
- **Local cuisine to try**
- **Cultural etiquette tips**

These places will inspire your next adventure and provide stories you'll treasure forever.`,
        excerpt:
          "Explore 10 amazing travel destinations that are off the beaten path and perfect for adventurous souls.",
        image: "/placeholder.svg?height=400&width=600&text=Hidden+Travel+Gems",
        category: "Travel",
        tags: ["travel", "destinations", "adventure", "hidden gems", "exploration"],
        author: createdUsers[1]._id,
        status: "published",
      },
      {
        title: "Building Healthy Habits That Actually Stick: A Science-Based Approach",
        content: `Creating lasting change in your life starts with building healthy habits. But why do some habits stick while others fade away after a few weeks? In this post, we'll explore the science behind habit formation and provide practical strategies for building habits that last.

## The Science of Habits

### The Habit Loop
Every habit consists of three components:
1. **Cue**: The trigger that initiates the behavior
2. **Routine**: The behavior itself
3. **Reward**: The benefit you gain from the behavior

### Neuroplasticity
Your brain physically changes when you form new habits. Neural pathways strengthen with repetition, making behaviors more automatic over time.

## Proven Strategies

### 1. Start Ridiculously Small
- Want to exercise? Start with 2 push-ups
- Want to read more? Start with 1 page
- Want to meditate? Start with 1 minute

### 2. Stack Your Habits
Attach new habits to existing ones:
- "After I pour my morning coffee, I will write in my journal"
- "After I brush my teeth, I will do 10 squats"

### 3. Design Your Environment
- Make good habits obvious and easy
- Make bad habits invisible and difficult

### 4. Track Your Progress
- Use a habit tracker app
- Mark an X on a calendar
- Keep a simple journal

## Common Obstacles and Solutions

- **Perfectionism**: Progress over perfection
- **All-or-nothing thinking**: Small steps count
- **Lack of motivation**: Rely on systems, not motivation
- **Social pressure**: Find accountability partners

Whether you want to exercise more, eat better, or develop a reading habit, these proven techniques will help you succeed in creating lasting positive change.`,
        excerpt:
          "Learn the science behind habit formation and practical strategies for creating lasting positive change.",
        image: "/placeholder.svg?height=400&width=600&text=Healthy+Habits",
        category: "Lifestyle",
        tags: ["habits", "health", "productivity", "self-improvement", "psychology"],
        author: createdUsers[2]._id,
        status: "published",
      },
      {
        title: "The Future of Remote Work: Trends and Predictions for 2024-2025",
        content: `Remote work has transformed from a perk to a necessity, and it's here to stay. In this comprehensive analysis, we'll examine the current state of remote work and predict future trends that will shape how we work in the coming years.

## Current State of Remote Work

### Statistics That Matter
- 35% of workers can work remotely full-time
- 42% of remote workers say they'd never return to office work
- Companies save an average of $11,000 per remote worker annually
- Remote workers report 20% higher productivity

## Emerging Trends

### 1. Hybrid Work Models
The future isn't fully remote or fully in-office—it's hybrid:
- 2-3 days in office, 2-3 days remote
- Flexible scheduling based on project needs
- Core collaboration hours with flexible personal time

### 2. Digital Nomadism Goes Mainstream
- More countries offering digital nomad visas
- Co-working spaces in exotic locations
- Companies embracing location-independent hiring

### 3. Advanced Collaboration Tools
- VR/AR meeting spaces
- AI-powered project management
- Real-time collaborative coding environments
- Spatial audio for better remote communication

### 4. Focus on Mental Health
- Mandatory disconnect hours
- Virtual wellness programs
- Mental health days as standard policy
- Ergonomic home office stipends

## Challenges and Solutions

### Communication Barriers
- **Problem**: Miscommunication and isolation
- **Solution**: Regular check-ins, clear documentation, video-first meetings

### Work-Life Balance
- **Problem**: Always-on mentality
- **Solution**: Clear boundaries, dedicated workspace, scheduled offline time

### Company Culture
- **Problem**: Maintaining team cohesion
- **Solution**: Virtual team building, shared values, regular social interactions

## Predictions for 2024-2025

1. **AI Integration**: AI assistants will handle routine tasks, freeing humans for creative work
2. **Outcome-Based Work**: Focus shifts from hours worked to results achieved
3. **Global Talent Pool**: Companies will hire the best talent regardless of location
4. **New Management Styles**: Leaders will adapt to manage distributed teams effectively

The future of work is flexible, technology-enabled, and human-centered. Companies that embrace these changes will attract top talent and achieve better results.`,
        excerpt: "An in-depth analysis of remote work trends and predictions for the future of distributed teams.",
        image: "/placeholder.svg?height=400&width=600&text=Future+of+Remote+Work",
        category: "Business",
        tags: ["remote work", "business", "future", "productivity", "trends"],
        author: createdUsers[2]._id,
        status: "published",
      },
      {
        title: "Full-Stack JavaScript: Building Modern Applications with the MERN Stack",
        content: `The MERN stack (MongoDB, Express.js, React, Node.js) has become one of the most popular choices for building modern web applications. In this comprehensive guide, we'll explore why MERN is so powerful and how to build scalable applications with it.

## Why Choose MERN?

### Advantages
- **Single Language**: JavaScript everywhere
- **Rich Ecosystem**: Vast npm package library
- **Fast Development**: Reusable components and rapid prototyping
- **Scalability**: Handles growth from startup to enterprise
- **Community Support**: Large, active developer community

## The Stack Breakdown

### MongoDB
- **Document Database**: Flexible schema design
- **JSON-like Documents**: Natural fit with JavaScript
- **Horizontal Scaling**: Built for modern applications
- **Atlas Cloud**: Managed database service

### Express.js
- **Minimal Framework**: Fast and unopinionated
- **Middleware System**: Extensible architecture
- **RESTful APIs**: Easy API development
- **Large Ecosystem**: Thousands of plugins

### React
- **Component-Based**: Reusable UI components
- **Virtual DOM**: Efficient rendering
- **Hooks**: Modern state management
- **Rich Ecosystem**: Tools and libraries

### Node.js
- **JavaScript Runtime**: Server-side JavaScript
- **Event-Driven**: Non-blocking I/O operations
- **NPM**: World's largest package registry
- **Performance**: Fast execution with V8 engine

## Building Your First MERN App

### Project Structure
\`\`\`
mern-app/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared utilities
└── package.json     # Root dependencies
\`\`\`

### Development Workflow
1. **Backend First**: Set up Express server and MongoDB
2. **API Development**: Create RESTful endpoints
3. **Frontend Setup**: Initialize React application
4. **Integration**: Connect frontend to backend
5. **Testing**: Unit and integration tests
6. **Deployment**: Deploy to cloud platforms

## Best Practices

### Security
- Input validation and sanitization
- JWT authentication
- HTTPS everywhere
- Environment variables for secrets

### Performance
- Database indexing
- Caching strategies
- Code splitting
- Image optimization

### Code Quality
- ESLint and Prettier
- TypeScript for type safety
- Git hooks for quality checks
- Comprehensive testing

The MERN stack provides everything you need to build modern, scalable web applications. Start with a simple project and gradually add complexity as you learn.`,
        excerpt:
          "A comprehensive guide to building modern web applications using MongoDB, Express.js, React, and Node.js.",
        image: "/placeholder.svg?height=400&width=600&text=MERN+Stack+Development",
        category: "Technology",
        tags: ["mern", "javascript", "mongodb", "react", "nodejs", "fullstack"],
        author: createdUsers[3]._id,
        status: "published",
        featured: true,
      },
      {
        title: "Digital Marketing in 2024: Strategies That Actually Work",
        content: `Digital marketing continues to evolve at breakneck speed. What worked last year might be obsolete today. In this post, we'll explore the digital marketing strategies that are actually working in 2024 and how to implement them effectively.

## The Current Digital Landscape

### Key Changes in 2024
- **AI Integration**: ChatGPT and AI tools reshape content creation
- **Privacy First**: iOS 14.5+ and cookie deprecation impact tracking
- **Short-Form Video**: TikTok and Instagram Reels dominate
- **Voice Search**: Optimization for voice queries becomes crucial
- **Sustainability**: Eco-conscious consumers drive green marketing

## Strategies That Work

### 1. Content Marketing 2.0
- **AI-Assisted Creation**: Use AI for ideation, not replacement
- **Interactive Content**: Polls, quizzes, and calculators
- **User-Generated Content**: Authentic customer stories
- **Video-First Approach**: Every piece of content should have a video version

### 2. Social Commerce
- **Instagram Shopping**: Direct product sales on social platforms
- **Live Shopping**: Real-time product demonstrations
- **Influencer Partnerships**: Micro-influencers over mega-influencers
- **Community Building**: Private groups and exclusive content

### 3. Email Marketing Renaissance
- **Personalization**: AI-driven content customization
- **Automation**: Sophisticated drip campaigns
- **Interactive Emails**: Embedded videos and polls
- **Mobile Optimization**: 70% of emails are opened on mobile

### 4. SEO Evolution
- **E-A-T**: Expertise, Authoritativeness, Trustworthiness
- **Core Web Vitals**: Page speed and user experience
- **Featured Snippets**: Optimize for position zero
- **Local SEO**: Google My Business optimization

## Measuring Success

### Key Metrics
- **Customer Lifetime Value (CLV)**
- **Return on Ad Spend (ROAS)**
- **Engagement Rate**: Quality over quantity
- **Brand Sentiment**: Social listening tools

### Tools and Platforms
- **Analytics**: Google Analytics 4, Adobe Analytics
- **Social Media**: Hootsuite, Buffer, Sprout Social
- **Email**: Mailchimp, ConvertKit, Klaviyo
- **SEO**: SEMrush, Ahrefs, Moz

The key to successful digital marketing in 2024 is staying agile, testing constantly, and focusing on providing genuine value to your audience.`,
        excerpt:
          "Discover the digital marketing strategies that are actually working in 2024 and how to implement them.",
        image: "/placeholder.svg?height=400&width=600&text=Digital+Marketing+2024",
        category: "Business",
        tags: ["digital marketing", "strategy", "social media", "seo", "content marketing"],
        author: createdUsers[4]._id,
        status: "published",
      },
    ]

    const createdPosts = await Post.create(posts)
    console.log(`✅ Created ${createdPosts.length} sample posts`)

    // Update users with their posts
    console.log("🔗 Linking posts to users...")
    for (let i = 0; i < createdUsers.length; i++) {
      const userPosts = createdPosts.filter((post) => post.author.toString() === createdUsers[i]._id.toString())
      await User.findByIdAndUpdate(createdUsers[i]._id, {
        posts: userPosts.map((post) => post._id),
      })
    }

    // Add some sample interactions
    console.log("❤️ Adding sample likes and comments...")

    // Add likes to posts
    for (const post of createdPosts) {
      const randomUsers = createdUsers.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1)
      for (const user of randomUsers) {
        if (user._id.toString() !== post.author.toString()) {
          post.likes.push({ user: user._id })
        }
      }
      await post.save()
    }

    // Add sample comments
    const sampleComments = [
      "Great post! Really helpful insights.",
      "Thanks for sharing this. Looking forward to more content like this!",
      "This is exactly what I was looking for. Bookmarked!",
      "Excellent explanation. Could you write more about this topic?",
      "Love your writing style. Keep up the great work!",
    ]

    for (const post of createdPosts.slice(0, 3)) {
      const randomUsers = createdUsers.sort(() => 0.5 - Math.random()).slice(0, 2)
      for (const user of randomUsers) {
        if (user._id.toString() !== post.author.toString()) {
          post.comments.push({
            user: user._id,
            content: sampleComments[Math.floor(Math.random() * sampleComments.length)],
          })
        }
      }
      await post.save()
    }

    console.log("\n🎉 Database seeded successfully!")
    console.log(`📊 Summary:`)
    console.log(`   • ${createdUsers.length} users created`)
    console.log(`   • ${createdPosts.length} posts created`)
    console.log(`   • Sample likes and comments added`)

    // Display login credentials
    console.log("\n🔐 Sample Login Credentials:")
    console.log("=" * 50)
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Password: ${user.password}`)
      console.log(`   Username: ${user.username}`)
      console.log("")
    })

    console.log("🚀 Your MindType API is ready to use!")
    console.log(`📍 API URL: http://localhost:${process.env.PORT || 5000}`)
  } catch (error) {
    console.error("❌ Seeding error:", error)
    console.error("Stack trace:", error.stack)
  } finally {
    await mongoose.connection.close()
    console.log("🔌 Database connection closed")
    process.exit(0)
  }
}

// Handle process termination
process.on("SIGINT", async () => {
  console.log("\n⚠️  Process interrupted")
  await mongoose.connection.close()
  process.exit(0)
})

seedData()
