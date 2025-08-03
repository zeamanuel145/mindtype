"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"

const Explore = ({ posts }) => {
  const [activeFilter, setActiveFilter] = useState("Music")

  const filters = [
    "Music",
    "UX Design",
    "Dev",
    "Software",
    "Money",
    "Cryptocurrency",
    "Machine Learning",
    "Productivity",
  ]

  const trends = [
    {
      title: "Voice of the designer",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      author: "Elizabeth Johnson",
      date: "12/12/2023",
    },
    {
      title: "Tips of the blog",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      author: "Elizabeth Johnson",
      date: "12/12/2023",
    },
    {
      title: "Future of AI",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      author: "Elizabeth Johnson",
      date: "12/12/2023",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore your Interests</h1>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-3 mb-8">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeFilter === filter
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="relative bg-gray-900 rounded-lg overflow-hidden aspect-[4/3] group cursor-pointer"
            >
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Travel"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-2">Travel</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Latest Trends */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trends.map((trend, index) => (
              <div
                key={index}
                className="bg-gray-900 text-white rounded-lg p-6 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src="/placeholder.svg?height=60&width=80"
                    alt={trend.title}
                    className="w-16 h-12 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{trend.title}</h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-3">{trend.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{trend.author}</span>
                      <span>{trend.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Button */}
        <div className="fixed bottom-8 right-8">
          <button className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg">
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Explore
