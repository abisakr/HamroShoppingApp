// src/pages/admin/AdminProducts.tsx
import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { categoryService, productService } from '../services/api'

const AdminProducts = () => {
  // Data States
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  // Form State
  const initialForm = {
    productName: '',
    categoryId: '',
    price: '',
    discount: '0',
    stockQuantity: '',
    description: '',
    deliveryStatus: 'Standard'
  }

  const [formData, setFormData] = useState(initialForm)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const BASE_URL = "https://localhost:7223"

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // 1. Load Categories (Using the fix that worked)
      const cData = await categoryService.getAll()
      const cleanCategories = Array.isArray(cData) ? cData : (cData?.$values || [])
      setCategories(cleanCategories)

      // 2. Load Products
      const pData = await productService.getAll()
      const cleanProducts = Array.isArray(pData) ? pData : (pData?.$values || [])
      setProducts(cleanProducts)

    } catch (err: any) {
      console.error("Load Error:", err)
      toast.error("Failed to load products or categories")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Opening Modal (Reset or Populate)
  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditId(product.id)
      setFormData({
        productName: product.productName || '',
        categoryId: product.categoryId?.toString() || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '0',
        stockQuantity: product.stockQuantity?.toString() || '',
        description: product.description || '',
        deliveryStatus: product.deliveryStatus || 'Standard'
      })
      setPreview(product.photoPath ? `${BASE_URL}${product.photoPath}` : null)
    } else {
      setEditId(null)
      setFormData(initialForm)
      setPreview(null)
    }
    setFile(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditId(null)
    setFormData(initialForm)
    setFile(null)
    setPreview(null)
  }

  // Handle Image Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  // Handle Submit (Create/Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.categoryId) {
        toast.error("Please select a category")
        return
    }

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
    })
    if (file) data.append('photo', file)

    try {
      if (editId) {
        await productService.edit(editId, data)
        toast.success("Product updated successfully")
      } else {
        await productService.create(data)
        toast.success("Product created successfully")
      }
      handleCloseModal()
      loadData()
    } catch (err: any) {
      toast.error(err.message || "Operation failed")
    }
  }

  // Handle Delete
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.delete(id)
        toast.success("Product deleted")
        loadData()
      } catch (err) {
        toast.error("Delete failed")
      }
    }
  }

  return (
    <div className="p-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Product Management</h1>
          
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-100"
        >
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-xs font-black text-gray-400 uppercase">Product</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase">Category</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase text-center">Price</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase text-center">Stock</th>
              <th className="p-6 text-xs font-black text-gray-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <img 
                        src={p.photoPath ? `${BASE_URL}${p.photoPath}` : 'https://via.placeholder.com/50'} 
                        className="w-12 h-12 object-cover rounded-xl shadow-sm bg-gray-100" 
                        alt="" 
                    />
                    <div>
                        <div className="font-black text-gray-900">{p.productName}</div>
                        <div className="text-[10px] text-gray-400 font-bold">ID: #{p.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-black uppercase">
                    {p.categoryName || 'No Category'}
                  </span>
                </td>
                <td className="p-6 text-center font-black text-gray-900">${p.price}</td>
                <td className="p-6 text-center">
                    <div className={`text-sm font-bold ${p.stockQuantity < 5 ? 'text-red-500' : 'text-gray-600'}`}>
                        {p.stockQuantity}
                    </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(p)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition">
                        <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition">
                        <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && !isLoading && (
            <div className="p-20 text-center text-gray-400 font-bold italic">No products available in inventory.</div>
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {editId ? 'Update Product' : 'Create New Product'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-black transition">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase ml-1">Product Title</label>
                <input 
                  required placeholder="Enter product name" 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold"
                  value={formData.productName} 
                  onChange={e => setFormData({...formData, productName: e.target.value})}
                />
              </div>

              {/* Category Dropdown */}
              <div className="col-span-1 space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase ml-1">Category</label>
                <select 
                  required
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold cursor-pointer appearance-none"
                  value={formData.categoryId} 
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id.toString()}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="col-span-1 space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase ml-1">Price ($)</label>
                <input 
                  type="number" required placeholder="0.00" 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold"
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>

              {/* Discount */}
              <div className="col-span-1 space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase ml-1">Discount (%)</label>
                <input 
                  type="number" placeholder="0" 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold"
                  value={formData.discount} 
                  onChange={e => setFormData({...formData, discount: e.target.value})}
                />
              </div>

              {/* Stock */}
              <div className="col-span-1 space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase ml-1">Stock Amount</label>
                <input 
                  type="number" required placeholder="0" 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold"
                  value={formData.stockQuantity} 
                  onChange={e => setFormData({...formData, stockQuantity: e.target.value})}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase ml-1">Description</label>
                <textarea 
                  required placeholder="Enter detailed product description..." 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold h-32 resize-none"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              {/* Image Upload Area */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase ml-1">Product Media</label>
                <label className="flex flex-col items-center gap-4 cursor-pointer p-8 border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50 hover:bg-gray-100 transition-all hover:border-blue-300">
                  {preview ? (
                    <img src={preview} className="h-40 w-40 object-cover rounded-[1.5rem] shadow-xl" alt="Preview" />
                  ) : (
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <FaImage className="text-3xl text-gray-200" />
                    </div>
                  )}
                  <div className="text-center">
                    <span className="text-sm font-black text-gray-700 block">Click to upload photo</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Recommended size: 800x800</span>
                  </div>
                  <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-2 flex gap-4 pt-6">
                <button 
                    type="submit" 
                    className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-95"
                >
                  {editId ? 'Update Changes' : 'Save Product'}
                </button>
                <button 
                    type="button" 
                    onClick={handleCloseModal} 
                    className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black text-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts