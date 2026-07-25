import { useEffect, useState } from 'react'
import { FaSearch, FaShoppingCart, FaBars, FaTimes, FaBox, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { cartService } from '../services/api' // Use your service

const Header = () => {
  const navigate = useNavigate()
  
  // Local States instead of Redux
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Check login status and cart count
  const updateHeaderState = async () => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    if (token) {
      try {
        const cartItems = await cartService.getAll()
        // Your API returns totalCarts in the array or we calculate length
        const count = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0)
        setCartCount(count)
      } catch (err) {
        setCartCount(0)
      }
    } else {
      setCartCount(0)
    }
  }

  useEffect(() => {
    updateHeaderState()

    // Listen for the "storage" event we dispatched in Login.tsx
    const handleAuthChange = () => {
      updateHeaderState()
    }

    window.addEventListener('storage', handleAuthChange)
    return () => window.removeEventListener('storage', handleAuthChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("token_expires")
    setIsLoggedIn(false)
    setCartCount(0)
    toast.success('Logged out successfully')
    navigate('/')
    setMobileMenuOpen(false)
    // Notify other components
    window.dispatchEvent(new Event("storage"))
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🛒</span>
            </div>
            <span className="font-black text-xl text-gray-900 hidden sm:block">HamroShoping</span>
          </Link>

          {/* Search Bar
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm font-medium"
              />
            </div>
          </form> */}

          {/* Right Icons */}
          <div className="flex items-center gap-3 md:gap-5">
            
            {/* Cart - Only show if logged in */}
            {isLoggedIn && (
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition">
                <FaShoppingCart className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Buttons / User Menu */}
            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    <FaUser />
                  </div>
                  <span className="hidden lg:inline text-sm font-bold text-gray-700">Account</span>
                </button>

                {/* Dropdown */}
               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-t-xl transition border-b border-gray-50">
    <FaUser className="text-blue-500" /> <span className="font-medium">My Profile</span>
  </Link>
  <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition">
    <FaBox className="text-blue-500" /> <span className="font-medium">My Orders</span>
  </Link>
  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-xl transition border-t border-gray-50">
    <FaSignOutAlt /> <span className="font-bold">Logout</span>
  </button>
</div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-lg transition">
                  Login
                </Link>
                <Link to="/sign-up" className="hidden sm:block px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600">
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white border-t pt-4 space-y-2">
            {!isLoggedIn ? (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 font-bold text-gray-700">Login</Link>
                <Link to="/sign-up" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 font-bold text-blue-600">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 font-medium text-gray-700">My Orders</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 font-bold text-red-600">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header