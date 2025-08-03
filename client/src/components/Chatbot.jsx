"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your MindType assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Predefined responses for common questions
  const botResponses = {
    greeting: [
      "Hello! Welcome to MindType. How can I assist you today?",
      "Hi there! I'm here to help you with your blogging journey.",
      "Hey! Ready to create some amazing content?",
    ],
    help: [
      "I can help you with:\n• Creating and editing posts\n• Understanding MindType features\n• Writing tips and suggestions\n• Navigation help\n• Account questions",
      "Here are some things I can assist with:\n• Getting started with your first post\n• Formatting and styling tips\n• Community guidelines\n• Technical support",
    ],
    writing: [
      "Here are some writing tips:\n• Start with a compelling headline\n• Use short paragraphs for readability\n• Include relevant images\n• End with a call-to-action\n• Proofread before publishing",
      "Great writing tips:\n• Know your audience\n• Tell a story\n• Use active voice\n• Break up text with subheadings\n• Edit ruthlessly",
    ],
    features: [
      "MindType features include:\n• Rich text editor\n• Image uploads\n• Category organization\n• Comment system\n• Social sharing\n• Analytics dashboard",
      "Key features:\n• Draft saving\n• Post scheduling\n• SEO optimization\n• Mobile-responsive design\n• Community interaction",
    ],
    default: [
      "I'm not sure about that specific question, but I'm here to help! Try asking about writing tips, MindType features, or how to get started.",
      "That's an interesting question! For specific technical issues, you might want to contact our support team. Is there anything else about MindType I can help with?",
      "I'd love to help! Could you rephrase your question or ask about something specific like creating posts, account settings, or writing tips?",
    ],
  }

  const getRandomResponse = (category) => {
    const responses = botResponses[category] || botResponses.default
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase()

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return getRandomResponse("greeting")
    }
    if (message.includes("help") || message.includes("support") || message.includes("assist")) {
      return getRandomResponse("help")
    }
    if (
      message.includes("write") ||
      message.includes("writing") ||
      message.includes("post") ||
      message.includes("blog")
    ) {
      return getRandomResponse("writing")
    }
    if (message.includes("feature") || message.includes("what can") || message.includes("how to")) {
      return getRandomResponse("features")
    }
    if (message.includes("create") || message.includes("new post")) {
      return "To create a new post:\n1. Click the 'Create Post' button\n2. Add a compelling title\n3. Write your content\n4. Add an image (optional)\n5. Choose a category\n6. Click 'Publish' or 'Save Draft'"
    }
    if (message.includes("edit") || message.includes("update")) {
      return "To edit a post:\n1. Go to 'My Posts'\n2. Click the edit icon on your post\n3. Make your changes\n4. Click 'Update Post' to save"
    }
    if (message.includes("profile") || message.includes("account")) {
      return "To edit your profile:\n1. Click your avatar in the top right\n2. Select 'Edit Profile'\n3. Update your information\n4. Click 'Save Changes'"
    }

    return getRandomResponse("default")
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(
      () => {
        const botResponse = {
          id: Date.now() + 1,
          text: getBotResponse(inputMessage),
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Chat Bot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">MindType Assistant</h3>
                <p className="text-xs text-blue-100">Online now</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === "bot" && <Bot className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />}
                    {message.sender === "user" && <User className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot
