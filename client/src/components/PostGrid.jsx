import PostCard from "./PostCard"

const PostGrid = ({ posts, showActions = false, onEdit, onDelete, title, subtitle, layout = "grid" }) => {
  if (layout === "masonry") {
    return (
      <div className="mb-12 lg:mb-16">
        {title && (
          <div className="text-center lg:text-left mb-8 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-4">{title}</h2>
            {subtitle && (
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto lg:mx-0">{subtitle}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 auto-rows-max">
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              showActions={showActions}
              onEdit={onEdit}
              onDelete={onDelete}
              variant={index === 0 ? "featured" : "default"}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-12 lg:mb-16">
      {title && (
        <div className="text-center lg:text-left mb-8 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 lg:mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto lg:mx-0">{subtitle}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-6 lg:gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} showActions={showActions} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

export default PostGrid
