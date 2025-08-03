import { Link } from "react-router-dom"
import { ArrowRight, Play, Sparkles } from "lucide-react"

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6 lg:mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/80 backdrop-blur-sm text-blue-800 shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome to MindType
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 lg:mb-8 leading-tight">
              This is for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Header 1.
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 lg:mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Write with style. Create with confidence. MindType helps you turn ideas into powerful stories with smart
              AI tools and a supportive creative community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6 mb-12 lg:mb-16">
              <Link
                to="/create-post"
                className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="group inline-flex items-center text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold text-base sm:text-lg">
                <div className="p-2 bg-white/80 backdrop-blur-sm rounded-full mr-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Play className="w-5 h-5" />
                </div>
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {[
                { value: "10,000+", label: "Active Writers" },
                { value: "50,000+", label: "Stories Published" },
                { value: "1M+", label: "Monthly Readers" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="relative z-10">
              <img
                src="/placeholder.svg?height=600&width=700"
                alt="Hero illustration"
                className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full animate-bounce delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
