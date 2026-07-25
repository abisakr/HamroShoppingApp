// src/pages/Cart.tsx
import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingCart, FaMapMarkerAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { cartService, orderService, authService } from '../services/api' // Added authService
import { formatters } from '../utils/helpers'
import { Skeleton } from '../components/Skeleton'
import Modal from '../components/Modal'
import FormInput from '../components/FormInput'

const BASE_URL = 'https://localhost:7223';

const Cart = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [address, setAddress] = useState('')
  
  // New state to store user profile data for address autofill
  const [userProfile, setUserProfile] = useState<any>(null)

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login", { state: { from: location.pathname } })
      return
    }

    setIsLoading(true)
    try {
      const data = await cartService.getAll()
      setItems(data)
      
      // Also fetch profile to have address ready for checkout
      const profile = await authService.getProfile()
      setUserProfile(profile)
    } catch (error: any) {
      console.error("Failed to load cart/profile", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, [items])

  // Function to autofill the address from profile
  const handleUseProfileAddress = () => {
    if (!userProfile) return;
    
    // Format: address, city, country
    const formattedAddress = [
      userProfile.address,
      userProfile.city,
      userProfile.country
    ].filter(Boolean).join(', '); // .filter(Boolean) removes empty/null fields

    if (formattedAddress) {
      setAddress(formattedAddress);
      toast.info("Address loaded from profile");
    } else {
      toast.warning("No address found in your profile.");
    }
  }

  const handleQuantityChange = async (id: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    try {
      await cartService.updateQuantity(id, newQty);
      const data = await cartService.getAll(); // Silent refresh
      setItems(data);
    } catch (err) { toast.error("Update failed"); }
  }

  const handleRemove = async (id: number) => {
    try {
      await cartService.delete(id);
      toast.success("Removed from cart");
      const data = await cartService.getAll();
      setItems(data);
      window.dispatchEvent(new Event("storage")); // Update header count
    } catch (err) { toast.error("Delete failed"); }
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) return toast.error("Shipping address is required");
    setIsProcessing(true);
    try {
      const orderData = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        orderAddress: address
      }));
      await orderService.createCartOrder(orderData);
      toast.success("Order Placed Successfully!");
      window.dispatchEvent(new Event("storage")); // Clear header count
      navigate('/orders');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  }

  if (isLoading) return <div className="p-10 max-w-7xl mx-auto"><Skeleton height="400px" className="rounded-3xl" /></div>

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="text-8xl text-gray-200"><FaShoppingCart /></div>
        <h2 className="text-3xl font-black text-gray-400">Your cart is empty</h2>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate(-1)} className="p-3 bg-white shadow-sm border border-gray-100 rounded-full hover:text-blue-600 transition">
            <FaArrowLeft />
          </button>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group">
                <Link to={`/product/${item.productId}`} className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.productPhoto ? `${BASE_URL}${item.productPhoto}` : 'https://via.placeholder.com/150'} 
                    alt={item.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>

                <div className="flex-1 text-center sm:text-left">
                  <Link to={`/product/${item.productId}`} className="font-black text-xl text-gray-800 hover:text-blue-600 transition-colors">
                    {item.productName}
                  </Link>
                  <p className="text-blue-600 font-black text-lg">{formatters.formatPrice(item.price)}</p>
                </div>

                <div className="flex items-center gap-5 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                  <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)} className="text-gray-400 hover:text-blue-600 transition"><FaMinus /></button>
                  <span className="font-black text-xl w-6 text-center">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="text-gray-400 hover:text-blue-600 transition"><FaPlus /></button>
                </div>

                <button onClick={() => handleRemove(item.id)} className="p-4 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><FaTrash /></button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 sticky top-24 space-y-6">
              <h2 className="text-2xl font-black text-gray-900">Order Summary</h2>
              <div className="space-y-4 border-b border-gray-50 pb-6 text-sm font-bold text-gray-500">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatters.formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-green-600 uppercase">Free</span></div>
              </div>
              <div className="flex justify-between text-2xl font-black text-gray-900">
                <span>Total</span><span className="text-blue-600">{formatters.formatPrice(totalPrice)}</span>
              </div>
              <button 
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CHECKOUT MODAL --- */}
      <Modal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} title="Complete Your Order">
         <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Shipping Address</label>
                {/* AUTOFILL BUTTON */}
                {userProfile && (
                  <button 
                    onClick={handleUseProfileAddress}
                    type="button"
                    className="text-[10px] font-black text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FaMapMarkerAlt /> Use profile address
                  </button>
                )}
              </div>
              <FormInput 
                placeholder="Address, City, Country"
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
               <div className="flex justify-between font-black text-gray-900">
                 <span>Grand Total</span>
                 <span className="text-blue-600">{formatters.formatPrice(totalPrice)}</span>
               </div>
            </div>

            <button 
                disabled={isProcessing}
                onClick={handlePlaceOrder}
                className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-lg hover:bg-blue-700 transition disabled:bg-gray-300"
            >
                {isProcessing ? "Processing Order..." : "Confirm & Place Order"}
            </button>
         </div>
      </Modal>
    </section>
  )
}

export default Cart;