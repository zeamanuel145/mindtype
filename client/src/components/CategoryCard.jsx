import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const CategoryCard = ({ category, image, count, link = "/explore" }) => {
  return (
    <Link
      to={link}
      className="flex grid-cols-2 group relative overflow-hidden rounded-2xl aspect-[4/3] bg-gradient-to-br from-gray-900 to-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
    >
      <img
        src={image || "/placeholder.svg"}
        alt={category}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            {category}
          </h3>
          {count && <p className="text-sm lg:text-base text-gray-300 mb-3 opacity-90">{count} stories</p>}
          <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
            <span className="text-sm font-medium mr-2">Explore</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
      <div className="absolute top-8 right-8 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
    </Link>
  )
}

export default CategoryCard
