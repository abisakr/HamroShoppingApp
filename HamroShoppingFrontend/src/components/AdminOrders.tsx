// src/components/AdminOrders.tsx
import React, { useEffect, useState } from 'react'
import { FaUser, FaMapMarkerAlt, FaPhone, FaTimes, FaBox, FaTruck, FaInfoCircle } from 'react-icons/fa'
import { orderService } from '../services/api'
import { toast } from 'react-toastify'
import { formatters } from '../utils/helpers'

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null) // State for Detail Modal
  const BASE_URL = "https://localhost:7223"

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const data = await orderService.getAllOrders()
      const cleanData = Array.isArray(data) ? data : (data?.$values || [])
      setOrders(cleanData)
    } catch (err) {
      toast.error("Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, newStatus)
      toast.success(`Order #${id} marked as ${newStatus}`)
      loadOrders() 
    } catch (err) {
      toast.error("Failed to update order status")
    }
  }

  const handleDeliveryChange = async (id: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, newStatus)
      toast.success(`Delivery #${id} updated to ${newStatus}`)
      loadOrders()
    } catch (err) {
      toast.error("Failed to update delivery status")
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order Management</h1>
        <p className="text-gray-500 font-bold">Process and track customer deliveries</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b">
            <tr>
              <th className="p-6 text-xs font-black text-gray-400 uppercase">Product Details</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase">Customer</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase text-center">Status</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase text-right">Update Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition">
                <td className="p-6">
                  {/* CLICKABLE PRODUCT INFO */}
                  <div 
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="relative overflow-hidden rounded-2xl w-14 h-14">
                        <img 
                            src={`${BASE_URL}${order.photoPath}`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition" 
                            alt="" 
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <FaInfoCircle className="text-white" />
                        </div>
                    </div>
                    <div>
                      <div className="font-black text-gray-900 group-hover:text-blue-600 transition">{order.productName}</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID: #{order.id}</div>
                    </div>
                  </div>
                </td>

                <td className="p-6">
                  <div className="font-bold text-gray-800 text-sm">{order.fullName || "Guest User"}</div>
                  <div className="text-[11px] text-gray-400 font-bold">{order.phoneNumber}</div>
                </td>

                <td className="p-6 text-center">
                    <div className="flex flex-col gap-1 items-center">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                           Order: {order.orderStatus || 'Ordered'}
                        </span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                           Delivery: {order.deliveryStatus || 'Pending'}
                        </span>
                    </div>
                </td>

                <td className="p-6 text-right">
                  <div className="flex flex-col gap-2 items-end">
                   
                    {/* DELIVERY STATUS DROPDOWN */}
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase">Shipment</span>
                        <select 
                            className="text-[11px] font-black bg-gray-50 border border-gray-200 p-2 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                            value={order.deliveryStatus || ''}
                            onChange={(e) => handleDeliveryChange(order.id, e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                        </select>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ORDER DETAIL MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Order Details</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID: #{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-black transition">
                    <FaTimes size={24} />
                </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="rounded-[2rem] overflow-hidden bg-gray-50 border h-64">
                    <img src={`${BASE_URL}${selectedOrder.photoPath}`} className="w-full h-full object-contain" alt="" />
                </div>

                {/* Details List */}
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Product</label>
                        <h3 className="text-xl font-black text-gray-800">{selectedOrder.productName}</h3>
                        <p className="text-sm font-bold text-gray-400">{selectedOrder.categoryName}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                        <div className="flex items-start gap-3">
                            <FaUser className="text-blue-500 mt-1" />
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Customer Name</p>
                                <p className="font-bold text-gray-800">{selectedOrder.fullName || "Guest"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FaPhone className="text-blue-500 mt-1" />
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Phone Number</p>
                                <p className="font-bold text-gray-800">{selectedOrder.phoneNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FaMapMarkerAlt className="text-blue-500 mt-1" />
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Delivery Address</p>
                                <p className="font-bold text-gray-800 text-sm leading-relaxed">{selectedOrder.address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-t pt-4">
                        <span className="font-black text-gray-400 uppercase text-xs">Total Amount</span>
                        <span className="text-2xl font-black text-blue-600">{formatters.formatPrice(selectedOrder.totalPrice)}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders