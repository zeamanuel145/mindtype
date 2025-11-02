const API_ENDPOINT = "http://127.0.0.1:8000/chat"

// DOM Elements
const chatMessages = document.getElementById("chatMessages")
const messageInput = document.getElementById("messageInput")
const sendBtn = document.getElementById("sendBtn")
const askBtn = document.getElementById("askBtn")
const generateBtn = document.getElementById("generateBtn")

// State
let isLoading = false

// Initialize
function init() {
  sendBtn.addEventListener("click", sendMessage)
  messageInput.addEventListener("keydown", handleKeyDown)
  askBtn.addEventListener("click", () => handleQuickAction("Tell me about MindType", "ask"))
  generateBtn.addEventListener("click", () => handleQuickAction("Create a random blog post of your own liking.", "generate"))

  // Auto-resize textarea
  messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto"
    messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + "px"
  })
}

// Format timestamp
function getTimestamp() {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Send message handler
function handleKeyDown(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

// Send user message
function sendMessage() {
  const text = messageInput.value.trim()
  if (!text || isLoading) return

  // Add user message
  addUserMessage(text)
  messageInput.value = ""
  messageInput.style.height = "auto"

  // Send to API
  sendToAPI(text, "chat")
}

// Quick action handler
function handleQuickAction(text, endpoint) {
  if (isLoading) return
  addUserMessage(text)
  sendToAPI(text, endpoint)
}

// Add user message to chat
function addUserMessage(text) {
  const messageDiv = document.createElement("div")
  messageDiv.className = "message user-message"
  messageDiv.innerHTML = `
        <div>${escapeHtml(text)}</div>
        <span class="timestamp">${getTimestamp()}</span>
    `
  chatMessages.appendChild(messageDiv)
  scrollToBottom()
}

// Add bot message to chat
function addBotMessage(content) {
  const messageDiv = document.createElement("div")
  messageDiv.className = "message bot-message"
  messageDiv.innerHTML = `
        ${content}
        <span class="timestamp">${getTimestamp()}</span>
    `
  chatMessages.appendChild(messageDiv)
  scrollToBottom()
}

// Display loading indicator
function addLoadingIndicator() {
  const messageDiv = document.createElement("div")
  messageDiv.className = "message bot-message"
  messageDiv.id = "loadingIndicator"
  messageDiv.innerHTML = `
        <div class="loading-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `
  chatMessages.appendChild(messageDiv)
  scrollToBottom()
}

// Remove loading indicator
function removeLoadingIndicator() {
  const indicator = document.getElementById("loadingIndicator")
  if (indicator) indicator.remove()
}

// Scroll to bottom
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight
}

// Format API response into 5 rows
function formatStructuredResponse(data) {
  let html = ""

  // Status Row
  if (data.status) {
    html += `
            <div class="response-row">
                <div class="response-row-label">Status</div>
                <div class="response-row-content">${escapeHtml(data.status)}</div>
            </div>
        `
  }

  // Title Row
  if (data.title) {
    html += `
            <div class="response-row">
                <div class="response-row-label">Title</div>
                <div class="response-row-content title">${escapeHtml(data.title)}</div>
            </div>
        `
  }
  
  if (data.content) {
    const formattedContent = data.content.replace(/\n/g, "<br>");
    
    html += `
            <div class="response-row content-full">
                <div class="response-row-label">Content</div>
                <div class="response-row-content blog-content">${formattedContent}</div> 
            </div>
        `
  }

  // Meta Row
  if (data.meta_description) {
    html += `
            <div class="response-row">
                <div class="response-row-label">Meta</div>
                <div class="response-row-content meta">${escapeHtml(data.meta_description)}</div>
            </div>
        `
  }

   // Preview Row
  if (data.blog_preview) {
    html += `
            <div class="response-row">
                <div class="response-row-label">Preview</div>
                <div class="response-row-content">${escapeHtml(data.blog_preview)}</div>
            </div>
        `
  }
 

  return html
}
// Send to API
async function sendToAPI(text, endpoint = "chat") {
  setLoading(true)
  addLoadingIndicator()

  try {
    const response = await fetch("https://mindtype.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic: text,
        tone:"informative" }
      ),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    removeLoadingIndicator()

    // Check if structured response
    if (data.title || data.content) {
      const html = formatStructuredResponse(data)
      addBotMessage(html)
    } else {
      // Simple text response
      const message = data.response || data.message || data.content || "Unable to get a response. Please try again."
      addBotMessage(`<p>${escapeHtml(message)}</p>`)
    }
  } catch (error) {
    console.error("Error:", error)
    removeLoadingIndicator()
    addBotMessage(`<p>Unable to connect to MindType. Please check your connection and try again.</p>`)
  } finally {
    setLoading(false)
  }
}

// Set loading state
function setLoading(loading) {
  isLoading = loading
  sendBtn.disabled = loading
  askBtn.disabled = loading
  generateBtn.disabled = loading
  messageInput.disabled = loading
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Start app
init()
