const TrendCard = ({ trend }) => {
  return (
    <div className="bg-gray-800 text-white rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer">
      <div className="flex items-start space-x-4">
        <img
          src={trend.image || "/placeholder.svg"}
          alt={trend.title}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
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
  )
}

export default TrendCard
