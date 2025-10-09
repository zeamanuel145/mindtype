"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Header from "./components/Header"
import ChatBot from "./components/ChatBot"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Explore from "./pages/Explore"
import MyPosts from "./pages/MyPosts"
import Profile from "./pages/Profile"
import CreatePost from "./pages/CreatePost"
import EditPost from "./pages/EditPost"
import PostDetail from "./pages/PostDetail"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Home />
                  <ChatBot />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Header />
                  <Dashboard />
                  <ChatBot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Header />
                  <Explore />
                  <ChatBot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-posts"
              element={
                <ProtectedRoute>
                  <Header />
                  <MyPosts />
                  <ChatBot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Header />
                  <Profile />
                  <ChatBot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <Header />
                  <CreatePost />
                  <ChatBot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-post/:id"
              element={
                <ProtectedRoute>
                  <Header />
                  <EditPost />
                  <ChatBot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post/:id"
              element={
                <ProtectedRoute>
                  <Header />
                  <PostDetail />
                  <ChatBot />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
