"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm MindType's AI blog assistant. What topic would you like to generate a blog post on today",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await fetch("https://mindtype.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: inputMessage }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      const botResponseText = data.response || data.content || "An error occurred generating the blog post. Please try again."

      const botMessage = {
        id: messages.length + 2,
        text: botResponseText,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Failed to fetch bot response:", error)
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm sorry, I couldn't connect to the server to generate a response. The backend is experiencing errors.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Custom CSS for Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
          }
        }
        
        .pulse-button {
          animation: pulse 2s infinite;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)} // Open directly on click
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group pulse-button"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Full Screen Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 slide-up">
          
          {/* Close Button (Top Right) */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="h-full flex flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-2xl h-full max-h-screen flex flex-col">

              {/* Header (Only shown when chat is empty) */}
              {messages.length === 1 && ( // Assuming the initial welcome message means the user hasn't started
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                    Ask AI to write a blog post!
                  </h1>
                </div>
              )}

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                
                {/* Initial Welcome Message (Styled for the full-screen design) */}
                {messages.length === 1 && (
                  <div className="flex justify-start">
                    <div className="bg-blue-500 text-white rounded-3xl px-6 py-4 max-w-md shadow-md">
                      <p className="text-sm sm:text-base">
                        {messages[0].text}
                      </p>
                      <p className="text-xs mt-2 text-blue-100">
                        {messages[0].timestamp}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Dynamically Rendered Messages */}
                {messages.slice(1).map((message) => ( // Start rendering from the second message
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      // Using the new rounded-3xl and removing the small user/bot icons next to the bubble
                      className={`rounded-3xl px-6 py-4 max-w-md shadow-md ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      <p className="text-sm sm:text-base whitespace-pre-wrap">{message.text}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.sender === "user" ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-3xl px-6 py-4 shadow-md">
                      <div className="flex space-x-2">
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
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Section (Rounded and Shadowed) */}
              <div className="bg-white rounded-full shadow-xl p-2 flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a blog topic..."
                  className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-gray-800 text-sm sm:text-base"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-full transition-colors flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Back Button (Exit Navigation) */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  BACK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot