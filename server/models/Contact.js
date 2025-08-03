const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters long"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: true,
      enum: ["general", "support", "bug", "feature", "business", "other"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    adminNotes: {
      type: String,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
      default: "",
    },
    resolution: {
      type: String,
      maxlength: [1000, "Resolution cannot exceed 1000 characters"],
      default: "",
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    responseTime: {
      type: Number, // in hours
      default: null,
    },
    ipAddress: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
contactSchema.index({ status: 1, createdAt: -1 })
contactSchema.index({ category: 1, createdAt: -1 })
contactSchema.index({ user: 1, createdAt: -1 })
contactSchema.index({ email: 1 })

// Calculate response time when resolved
contactSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "resolved" && !this.resolvedAt) {
    this.resolvedAt = new Date()
    this.responseTime = Math.round((this.resolvedAt - this.createdAt) / (1000 * 60 * 60)) // hours
  }
  next()
})

module.exports = mongoose.model("Contact", contactSchema)
