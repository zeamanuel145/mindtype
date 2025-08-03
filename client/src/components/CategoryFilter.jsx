"use client"

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange && onCategoryChange(category)}
          className={`px-4 py-2 rounded-full border text-sm transition-colors ${
            activeCategory === category
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
