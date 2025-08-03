const express = require("express")
const Contact = require("../models/Contact")
const { auth, adminAuth } = require("../middleware/auth")

const router = express.Router()

// Submit contact form (public endpoint)
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message, category = "general" } = req.body

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }

    if (name.length > 100) {
      return res.status(400).json({ message: "Name cannot exceed 100 characters" })
    }

    if (subject.length > 200) {
      return res.status(400).json({ message: "Subject cannot exceed 200 characters" })
    }

    if (message.length < 10 || message.length > 2000) {
      return res.status(400).json({ message: "Message must be between 10 and 2000 characters" })
    }

    // Get client IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress
    const userAgent = req.get("User-Agent") || ""

    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      category,
      user: req.userId || null, // If user is logged in
      ipAddress,
      userAgent,
    })

    await contact.save()

    res.status(201).json({
      message: "Contact form submitted successfully. We'll get back to you soon!",
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        category: contact.category,
        status: contact.status,
        createdAt: contact.createdAt,
      },
    })
  } catch (error) {
    console.error("Contact submission error:", error)
    res.status(500).json({
      message: "Failed to submit contact form",
      error: error.message,
    })
  }
})

// Get all contacts (admin only)
router.get("/", auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, priority, search, sort = "-createdAt" } = req.query

    // Build query
    const query = {}
    if (status) query.status = status
    if (category) query.category = category
    if (priority) query.priority = priority
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ]
    }

    const pageNum = Number.parseInt(page)
    const limitNum = Number.parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const contacts = await Contact.find(query)
      .populate("user", "username firstName lastName email")
      .populate("assignedTo", "username firstName lastName")
      .sort(sort)
      .limit(limitNum)
      .skip(skip)

    const total = await Contact.countDocuments(query)

    res.json({
      contacts,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
    })
  } catch (error) {
    console.error("Get contacts error:", error)
    res.status(500).json({
      message: "Failed to fetch contacts",
      error: error.message,
    })
  }
})

// Get single contact (admin only)
router.get("/:id", auth, adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate("user", "username firstName lastName email avatar")
      .populate("assignedTo", "username firstName lastName email")

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" })
    }

    res.json({ contact })
  } catch (error) {
    console.error("Get contact error:", error)
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Contact not found" })
    }
    res.status(500).json({
      message: "Failed to fetch contact",
      error: error.message,
    })
  }
})

// Update contact (admin only)
router.put("/:id", auth, adminAuth, async (req, res) => {
  try {
    const { status, priority, assignedTo, adminNotes, resolution } = req.body

    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" })
    }

    // Update fields
    if (status !== undefined) contact.status = status
    if (priority !== undefined) contact.priority = priority
    if (assignedTo !== undefined) contact.assignedTo = assignedTo
    if (adminNotes !== undefined) contact.adminNotes = adminNotes
    if (resolution !== undefined) contact.resolution = resolution

    await contact.save()

    await contact.populate("user", "username firstName lastName email")
    await contact.populate("assignedTo", "username firstName lastName")

    res.json({
      message: "Contact updated successfully",
      contact,
    })
  } catch (error) {
    console.error("Update contact error:", error)
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Contact not found" })
    }
    res.status(500).json({
      message: "Failed to update contact",
      error: error.message,
    })
  }
})

// Delete contact (admin only)
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" })
    }

    await Contact.findByIdAndDelete(req.params.id)

    res.json({ message: "Contact deleted successfully" })
  } catch (error) {
    console.error("Delete contact error:", error)
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Contact not found" })
    }
    res.status(500).json({
      message: "Failed to delete contact",
      error: error.message,
    })
  }
})

// Get contact statistics (admin only)
router.get("/stats/overview", auth, adminAuth, async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments()

    const statusStats = await Contact.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])

    const categoryStats = await Contact.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }])

    const priorityStats = await Contact.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }])

    const avgResponseTime = await Contact.aggregate([
      { $match: { responseTime: { $ne: null } } },
      { $group: { _id: null, avgTime: { $avg: "$responseTime" } } },
    ])

    const recentContacts = await Contact.find()
      .sort("-createdAt")
      .limit(5)
      .populate("user", "username firstName lastName")

    res.json({
      totalContacts,
      statusBreakdown: statusStats.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {}),
      categoryBreakdown: categoryStats.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {}),
      priorityBreakdown: priorityStats.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {}),
      averageResponseTime: avgResponseTime[0]?.avgTime || 0,
      recentContacts,
    })
  } catch (error) {
    console.error("Get contact stats error:", error)
    res.status(500).json({
      message: "Failed to fetch contact statistics",
      error: error.message,
    })
  }
})

module.exports = router
