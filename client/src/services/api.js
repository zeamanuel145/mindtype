const API_BASE_URL = import.meta.env.VITE_API_URL || "https://mindtype-1.onrender.com"

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem("token")
  }

  // Set auth token
  setAuthToken(token) {
    localStorage.setItem("token", token)
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem("token")
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getAuthToken()

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      return data
    } catch (error) {
      console.error("API Request Error:", error)
      throw error
    }
  }

  // Auth methods
  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (response.token) {
      this.setAuthToken(response.token)
    }

    return response
  }

  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" })
    } finally {
      this.removeAuthToken()
    }
  }

  async getCurrentUser() {
    return this.request("/auth/me")
  }

  // Posts methods
  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/posts${queryString ? `?${queryString}` : ""}`)
  }

  async getPost(id) {
    return this.request(`/posts/${id}`)
  }

  async createPost(postData) {
    return this.request("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    })
  }

  async updatePost(id, postData) {
    return this.request(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(postData),
    })
  }

  async deletePost(id) {
    return this.request(`/posts/${id}`, {
      method: "DELETE",
    })
  }

  async likePost(id) {
    return this.request(`/posts/${id}/like`, {
      method: "POST",
    })
  }

  async addComment(postId, content) {
    return this.request(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    })
  }

  async getUserPosts(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/posts/user/${userId}${queryString ? `?${queryString}` : ""}`)
  }

  // Users methods
  async getUser(id) {
    return this.request(`/users/${id}`)
  }

  async updateProfile(profileData) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async followUser(id) {
    return this.request(`/users/${id}/follow`, {
      method: "POST",
    })
  }

  async getUserFollowers(id) {
    return this.request(`/users/${id}/followers`)
  }

  async getUserFollowing(id) {
    return this.request(`/users/${id}/following`)
  }
}

export default new ApiService()
