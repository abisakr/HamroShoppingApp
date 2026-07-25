import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '../App'

// User Pages
import Home from '../pages/Home'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Orders from '../pages/Orders'

// Admin Components & Pages
import AdminLogin from '../pages/AdminLogin'
import AdminLayout from '../components/AdminLayout'
import AdminProducts from '../components/AdminProducts'
import AdminCategories from '../components/AdminCategories'
import AdminDashboard from '../components/AdminDashboard' // Import the specific content component
import AdminOrders from '../components/AdminOrders'
import Profile from '../components/Profile'

/**
 * Simple Auth Guard 
 * Redirects to admin-login if token is missing or role is not admin
 */
const ProtectedAdmin = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  
  if (!token || role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App contains the User Header and Footer
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'sign-up', element: <SignUp /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: 'cart', element: <Cart /> },
      { path: 'orders', element: <Orders /> },
          { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: '/admin-login',
    element: <AdminLogin />, // Plain page (No Sidebar/Header)
  },
  {
    path: '/admin',
    element: (
      <ProtectedAdmin>
        <AdminLayout /> {/* This provides the Sidebar once */}
      </ProtectedAdmin>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      
      // FIXED: Use AdminDashboard here, NOT AdminLayout
      { path: 'dashboard', element: <AdminDashboard /> }, 
      
      { path: 'products', element: <AdminProducts /> },
      { path: 'categories', element: <AdminCategories /> },
        { path: 'orders', element: <AdminOrders /> },
            { path: 'profile', element: <Profile /> },
    ],
  },
])

export default router