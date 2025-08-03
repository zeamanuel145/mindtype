import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center space-x-6 mb-4">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-gray-900 font-bold text-sm">M</span>
          </div>
          <span className="font-bold text-xl">MINDTYPE</span>
        </div>
        <div className="flex justify-center space-x-8 text-sm">
          <Link to="/contact" className="hover:text-gray-300 transition-colors">
            Contact
          </Link>
          <Link to="/info" className="hover:text-gray-300 transition-colors">
            Info
          </Link>
          <Link to="/help" className="hover:text-gray-300 transition-colors">
            Help
          </Link>
          <Link to="/privacy" className="hover:text-gray-300 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
