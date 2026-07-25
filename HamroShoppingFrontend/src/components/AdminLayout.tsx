import { Outlet, Link, useNavigate } from 'react-router-dom'
import { FaBox, FaTags, FaChartBar, FaSignOutAlt, FaHome, FaShoppingCart, FaUser } from 'react-icons/fa'

const AdminLayout = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-black text-blue-500 uppercase tracking-tighter">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl transition font-bold text-gray-300 hover:text-white">
            <FaChartBar /> Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl transition font-bold text-gray-300 hover:text-white">
            <FaBox /> Products
          </Link>
          <Link to="/admin/categories" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl transition font-bold text-gray-300 hover:text-white">
            <FaTags /> Categories
          </Link>
            <Link to="/admin/orders" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl transition font-bold text-gray-300 hover:text-white">
        <FaShoppingCart /> Orders
        
        
    </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link to="/" className="flex items-center gap-3 p-3 text-blue-400 hover:bg-gray-800 rounded-xl transition font-bold">
            <FaHome /> Back to Shop
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-950 rounded-xl transition font-bold">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b p-4 flex justify-end items-center">
           <Link to="/admin/profile" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl transition font-bold text-gray-300 hover:text-white">
    <FaUser />
  </Link>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout