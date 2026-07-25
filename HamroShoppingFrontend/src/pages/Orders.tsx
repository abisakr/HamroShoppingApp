// src/pages/Orders.tsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaBox, FaHistory, FaMapMarkerAlt, FaInfoCircle, FaTag, FaUser } from 'react-icons/fa'
import { orderService } from '../services/api'
import { formatters } from '../utils/helpers'
import { Skeleton } from '../components/Skeleton'

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const BASE_URL = "https://localhost:7223"

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getUserOrders()
        // Handle .NET $values wrapper if present in the response
        const cleanData = Array.isArray(data) ? data : (data?.$values || [])
        setOrders(cleanData)
      } catch (err) {
        console.error("Error fetching orders:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton height="40px" width="200px" className="mb-8" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} height="180px" className="rounded-[2.5rem]" />
        ))}
      </div>
    )
  }

  return (
    <section className="p-8 max-w-7xl mx-auto min-h-screen animate-in fade-in duration-500">
      
      {/* 1. BACK BUTTON */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-400 hover:text-blue-600 mb-8 font-black transition-all group"
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Shop
      </button>

      {/* 2. HEADER */}
      <div className="flex items-center gap-5 mb-12">
        <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-100">
           <FaHistory size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order History</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Manage and track your recent purchases</p>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-8">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-50/50 transition-all duration-500"
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                  
                  {/* --- LEFT: PHOTO & PRODUCT INFO --- */}
                  <div className="flex items-center gap-6 w-full lg:w-1/3">
                    {/* Clickable Image to Redirect */}
                    <Link 
                      to={`/product/${order.productId}`} 
                      className="w-28 h-28 md:w-36 md:h-36 bg-gray-50 rounded-[2rem] flex-shrink-0 border border-gray-100 overflow-hidden group relative shadow-inner"
                    >
                      <img 
                        src={order.photoPath ? `${BASE_URL}${order.photoPath}` : 'https://via.placeholder.com/150'} 
                        alt={order.productName} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-black uppercase">View Details</span>
                      </div>
                    </Link>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-500">
                         <FaTag size={10} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{order.categoryName}</span>
                      </div>
                      <Link to={`/product/${order.productId}`}>
                        <h3 className="font-black text-xl text-gray-900 hover:text-blue-600 transition-colors leading-tight">
                          {order.productName}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <p className="text-gray-400 font-bold text-xs italic">Order ID: #{order.id}</p>
                        <p className="text-gray-400 font-bold text-xs italic">Qty: {order.quantity}</p>
                      </div>
                    </div>
                  </div>

                  {/* --- MIDDLE: SHIPPING ADDRESS --- */}
                  <div className="flex-1 w-full lg:w-auto p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="flex items-start gap-4">
                      <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" size={16} />
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping Destination</p>
                        <p className="text-sm font-bold text-gray-700 leading-relaxed">
                          {order.address || "No shipping address provided"}
                        </p>
                        {order.phoneNumber && (
                          <p className="text-[11px] font-black text-gray-400 mt-2">Contact: {order.phoneNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* --- RIGHT: PRICING & STATUSES --- */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 lg:min-w-[150px]">
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="font-black text-3xl text-gray-900">
                        {formatters.formatPrice(order.totalPrice)}
                      </p>
                      <p className="text-[10px] font-bold text-gray-300 mt-1">
                         Unit: {formatters.formatPrice(order.unitPrice)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Order Status Badge */}
                      <span className="px-5 py-2 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                        {order.orderStatus || 'Ordered'}
                      </span>
                      
                      {/* Delivery Status Indicator */}
                      {order.deliveryStatus && (
                        <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                          <FaInfoCircle size={10} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">{order.deliveryStatus}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* --- EMPTY STATE --- */
        <div className="py-32 text-center bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-8 text-gray-200">
            <FaBox size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900">No history found</h2>
          <p className="text-gray-400 font-bold mt-2 mb-10 max-w-xs mx-auto leading-relaxed">
            You haven't placed any orders yet. Explore our products and start your first order!
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            Start Shopping
          </button>
        </div>
      )}
    </section>
  )
}

export default Orders;