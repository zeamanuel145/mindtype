const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Check if user still exists
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return res.status(401).json({ message: "Token is no longer valid." })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated." })
    }

    req.userId = decoded.userId
    req.user = user
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." })
    }

    console.error("Auth middleware error:", error)
    res.status(500).json({ message: "Authentication failed." })
  }
}

module.exports = auth
