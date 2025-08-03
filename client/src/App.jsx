"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Chatbot from "./components/Chatbot"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Explore from "./pages/Explore"
import MyPosts from "./pages/MyPosts"
import Profile from "./pages/Profile"
import CreatePost from "./pages/CreatePost"
import EditPost from "./pages/EditPost"
import PostDetail from "./pages/PostDetail"
import "./App.css"

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching posts:", err)
        setLoading(false)
      })
  }, [])

  const addPost = (newPost) => {
    // Optionally POST to backend API here to save new post
    const post = {
      ...newPost,
      id: posts.length + 1, // ideally backend generates id
      author: "Elizabeth Johnson",
      date: new Date().toLocaleDateString(),
    }
    setPosts([...posts, post])
  }

  const updatePost = (id, updatedPost) => {
    setPosts(posts.map((post) => (post.id === Number.parseInt(id) ? { ...post, ...updatedPost } : post)))
  }

  const deletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId))
  }

  if (loading) {
    return <div>Loading posts...</div>
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home posts={posts} />} />
          <Route path="/dashboard" element={<Dashboard posts={posts} />} />
          <Route path="/explore" element={<Explore posts={posts} />} />
          <Route path="/my-posts" element={<MyPosts posts={posts} onDeletePost={deletePost} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost onAddPost={addPost} />} />
          <Route path="/edit-post/:id" element={<EditPost posts={posts} onUpdatePost={updatePost} />} />
          <Route path="/post/:id" element={<PostDetail posts={posts} />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  )
}

export default App
