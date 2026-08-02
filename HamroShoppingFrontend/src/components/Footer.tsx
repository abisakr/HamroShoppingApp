// src/components/Footer.tsx
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-black mb-4 text-blue-500">HamroShop</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premium destination for quality products and exceptional shopping experience. 
              We deliver quality at your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-400 hover:text-white transition text-sm">Home</Link>
              <Link to="/orders" className="text-gray-400 hover:text-white transition text-sm">My Orders</Link>
              <Link to="/cart" className="text-gray-400 hover:text-white transition text-sm">Shopping Cart</Link>
            </nav>
          </div>

          {/* Support & Admin */}
          <div>
            <h4 className="font-bold text-lg mb-4">Legal & Staff</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="#" className="text-gray-400 hover:text-white transition text-sm">Privacy Policy</Link>
              <Link to="#" className="text-gray-400 hover:text-white transition text-sm">Terms of Service</Link>
              {/* ADMIN REDIRECT LINK */}
              <Link 
                to="/admin-login" 
                className="text-gray-600 hover:text-red-500 transition text-xs mt-4 italic font-medium border-t border-gray-800 pt-2 w-fit"
              >
                Admin Portal login
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} HamroShop. All rights reserved.
          </p>
          <div className="flex gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="paypal" className="h-4 opacity-50" />
            {/* <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="visa" className="h-4 opacity-50" /> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer