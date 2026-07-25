import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa'
import { Product } from '../types'
import { formatters } from '../utils/helpers'
import { cartService } from '../services/api' 
import { toast } from 'react-toastify'

const BASE_URL = 'https://localhost:7223'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const navigate = useNavigate()
  const location = useLocation() // Get current path (e.g., "/")

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Stop the <Link> from navigating to details page
    
    const token = localStorage.getItem("token");

    // AUTH CHECK: If no token, send to login but remember THIS page
    if (!token) {
      toast.info("Please login to add items to your cart");
      return navigate("/login", { state: { from: location.pathname } });
    }

    if (product.stockQuantity <= 0) {
      return toast.error("Out of stock");
    }

    setIsAdding(true)
    try {
      await cartService.addToCart(product.id)
      toast.success(`${product.productName} added to cart!`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  const discountedPrice = product.price - (product.price * (Number(product.discount) || 0)) / 100
  const imageUrl = product.photoPath ? `${BASE_URL}${product.photoPath}` : 'https://via.placeholder.com/300'

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group border border-gray-100">
      <Link to={`/product/${product.id}`}>
        <div className="relative h-64 overflow-hidden bg-gray-50">
          <img 
            src={imageUrl} 
            alt={product.productName} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          {Number(product.discount) > 0 && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-black shadow-lg">
              {product.discount}% OFF
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link to={`/product/${product.id}`} className="font-bold text-gray-800 text-lg line-clamp-1 hover:text-blue-600 transition-colors">
          {product.productName}
        </Link>
        
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-blue-600">{formatters.formatPrice(discountedPrice)}</span>
          {Number(product.discount) > 0 && (
            <span className="text-sm line-through text-gray-400 font-medium">{formatters.formatPrice(product.price)}</span>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stockQuantity === 0}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 font-bold"
          >
            <FaShoppingCart className={isAdding ? "animate-bounce" : ""} />
            {isAdding ? 'Adding...' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }} 
            className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard