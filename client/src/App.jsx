import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { SidebarProvider } from "./context/SidebarContext"
import { ThemeProvider } from "./context/ThemeContext"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ResetPassword from "./pages/ResetPassword"
import Dashboard from "./pages/Dashboard"
import CreatePost from "./pages/CreatePost"
import EditPost from "./pages/EditPost"
import MyPosts from "./pages/MyPosts"
import PostDetail from "./pages/PostDetail"
import Posts from "./pages/Posts"
import Profile from "./pages/Profile"
import Contact from "./pages/Contact"
import "./App.css"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <Sidebar />
              <main>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/posts" element={<Posts />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-post"
                    element={
                      <ProtectedRoute>
                        <CreatePost />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-post/:id"
                    element={
                      <ProtectedRoute>
                        <EditPost />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-posts"
                    element={
                      <ProtectedRoute>
                        <MyPosts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
