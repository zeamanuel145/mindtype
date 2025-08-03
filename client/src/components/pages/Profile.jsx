import { Edit } from "lucide-react"

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src="/placeholder.svg?height=80&width=80"
                alt="Elizabeth Johnson"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Elizabeth Johnson</h2>
              <p className="text-gray-600 mb-4">Content Creator</p>

              <button className="inline-flex items-center bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
