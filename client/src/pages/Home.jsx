import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import { MessageCircle } from "lucide-react"

const Home = ({ posts }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-1 grid-cols-2 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">This is for Header 1.</h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Write with style. Create with confidence. MindType helps you turn ideas into powerful stories with smart
                AI tools and a supportive creative community.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Get Started
                </Link>
                <Link
                  to="/create-post"
                  className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Create Post
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="./images/hero.png"
                alt="Hero illustration"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest posts</h2>
            <button className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts
              .concat(posts)
              .slice(0, 6)
              .map((post, index) => (
                <Link
                  key={index}
                  to={`/post/${post.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border"
                >
                  <img
                    src={post.image || "/placeholder.svg?height=200&width=300"}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="text-blue-600 text-sm font-medium">READ MORE →</div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Categories</h2>
          <div className="grid sm:grid-cols-2 grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Link
                key={item}
                to="/explore"
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
