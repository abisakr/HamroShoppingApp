import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { FaArrowLeft, FaShoppingCart, FaStar, FaCheck, FaTrash, FaEdit, FaTimes, FaPlus, FaMinus } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { productService, cartService, ratingService } from '../services/api'
import { formatters } from '../utils/helpers'
import { Skeleton } from '../components/Skeleton'

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem("token")

  // --- DATA STATES ---
  const [product, setProduct] = useState<any>(null)
  const [ratings, setRatings] = useState<any[]>([])
  const [userRating, setUserRating] = useState<any>(null)
  
  // --- UI STATES ---
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // --- MODAL & REVIEW FORM STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ratingValue, setRatingValue] = useState(5)
  const [reviewText, setReviewText] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const BASE_URL = "https://localhost:7223"

  useEffect(() => {
    if (id) {
      loadProduct(id)
      loadRatings(id)
    }
  }, [id])

  // --- LOAD DATA FUNCTIONS ---
  const loadProduct = async (productId: string) => {
    setIsLoading(true)
    try {
      const data = await productService.getById(Number(productId))
      setProduct(data)
    } catch (err: any) {
      toast.error("Product not found")
    } finally {
      setIsLoading(false)
    }
  }

  const loadRatings = async (productId: string) => {
    try {
      const allRatings = await ratingService.getByProduct(Number(productId))
      // Handle .NET $values wrapper if it exists
      const cleanRatings = Array.isArray(allRatings) ? allRatings : (allRatings?.$values || [])
      setRatings(cleanRatings)
      
      if (token) {
        const myRating = await ratingService.getUserRatingForProduct(Number(productId))
        if (myRating) {
          setUserRating(myRating)
          setRatingValue(myRating.userRating)
          setReviewText(myRating.review)
        }
      }
    } catch (err) {
      console.error("Error loading reviews", err)
    }
  }

  // --- ADD TO CART LOGIC ---
  const handleAddToCart = async () => {
    if (!token) {
      toast.warning("Please login to add items to cart");
      return navigate("/login", { state: { from: location.pathname } });
    }

    setIsProcessing(true)
    try {
      // Loop to add multiple quantities based on user selection
      for (let i = 0; i < quantity; i++) {
        await cartService.addToCart(product.id)
      }
      toast.success(`${product.productName} item(s) added to cart!`)
      
      // Update Header cart count by triggering storage event
      window.dispatchEvent(new Event("storage"))
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart")
    } finally {
      setIsProcessing(false)
    }
  }

  // --- REVIEW ACTIONS ---
  const openReviewModal = (editMode = false) => {
    if (!token) {
      toast.warning("Please login to write a review");
      return navigate("/login", { state: { from: location.pathname } });
    }
    setIsEditing(editMode)
    setIsModalOpen(true)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && userRating) {
        await ratingService.update(userRating.id, {
          productId: product.id,
          userRating: ratingValue,
          review: reviewText
        })
        toast.success("Review updated successfully")
      } else {
        await ratingService.create({
          productId: product.id,
          userRating: ratingValue,
          review: reviewText
        })
        toast.success("Review submitted! Thank you.")
      }
      setIsModalOpen(false)
      loadRatings(product.id.toString())
    } catch (err: any) {
      toast.error("Failed to save review")
    }
  }

  const handleDeleteReview = async (ratingId: number) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return
    try {
      await ratingService.delete(ratingId)
      toast.success("Review deleted")
      setUserRating(null)
      setReviewText("")
      setRatingValue(5)
      loadRatings(product.id.toString())
    } catch (err) {
      toast.error("Failed to delete review")
    }
  }

  // --- RENDER HELPERS ---
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-20">
        <Skeleton height="500px" className="rounded-3xl" />
      </div>
    )
  }

  if (!product || !product.id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/" className="text-blue-600 mt-4">Back to Shop</Link>
      </div>
    )
  }

  const discountedPrice = product.price - (product.price * (Number(product.discount) || 0) / 100);

  return (
    <section className="min-h-screen bg-white py-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-black mb-8 font-bold transition">
          <FaArrowLeft /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* LEFT: Product Image */}
          <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 bg-gray-50 h-[500px] flex items-center justify-center shadow-inner">
            <img
              src={product.photoPath ? `${BASE_URL}${product.photoPath}` : 'https://via.placeholder.com/600'}
              alt={product.productName}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-blue-600 font-black text-sm uppercase tracking-widest">{product.categoryName}</span>
              <h1 className="text-5xl font-black text-gray-900 leading-tight">{product.productName}</h1>
              
              <div 
                onClick={() => userRating ? openReviewModal(true) : openReviewModal(false)}
                className="flex items-center gap-2 mt-3 text-yellow-400 cursor-pointer hover:opacity-75 transition group"
              >
                <FaStar /> 
                <span className="text-gray-900 font-black text-lg">{product.productRating?.toFixed(1) || "0.0"}</span>
                <span className="text-gray-400 text-sm font-bold underline decoration-dotted group-hover:text-blue-600">
                  ({ratings.length} customer reviews)
                </span>
              </div>
            </div>

            {/* Price Card */}
            <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black text-blue-700">
                  {formatters.formatPrice(discountedPrice)}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-2xl line-through text-gray-300 font-bold">
                      {formatters.formatPrice(product.price)}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-xl text-xs font-black animate-pulse">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-gray-500 text-lg leading-relaxed whitespace-pre-line" >{product.description}</p>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              <div className="flex items-center border-2 border-gray-100 rounded-2xl bg-white p-1">
                <button 
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-xl transition" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  <FaMinus size={12} />
                </button>
                <span className="px-8 font-black text-2xl w-20 text-center">{quantity}</span>
                <button 
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-xl transition" 
                  onClick={() => setQuantity(q => q + 1)}
                >
                  <FaPlus size={12} />
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={isProcessing || product.stockQuantity === 0}
                className="flex-1 w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition shadow-2xl shadow-blue-200 active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
              >
                <FaShoppingCart />
                {isProcessing ? 'Adding...' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            <div className="pt-8 border-t flex gap-6 text-sm font-bold text-gray-400">
              <div className="flex items-center gap-2 text-green-600"><FaCheck /> 100% Authentic</div>
              <div className="flex items-center gap-2 uppercase tracking-wider">In Stock: {product.stockQuantity}</div>
            </div>
          </div>
        </div>

        {/* --- REVIEWS DISPLAY SECTION --- */}
        <div className="border-t pt-16">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
            <h2 className="text-4xl font-black text-gray-900">Customer Feedback</h2>
            {!userRating && (
              <button 
                onClick={() => openReviewModal(false)} 
                className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-black transition-all shadow-lg"
              >
                Write a Review
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ratings.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed">
                <p className="text-gray-400 text-xl font-bold italic">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              ratings.map((rev) => (
                <div key={rev.id} className="p-8 border border-gray-100 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3">
                      <div className="flex text-yellow-400 gap-1 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < rev.userRating ? 'text-yellow-400' : 'text-gray-200'} />
                        ))}
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed font-medium italic">"{rev.review}"</p>
                      <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Verified User • ID {rev.userId.substring(0,8)}</div>
                    </div>
                    
                    {/* User's Own Review Actions */}
                    {userRating?.id === rev.id && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openReviewModal(true)} 
                          className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                          title="Edit review"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteReview(rev.id)} 
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition"
                          title="Delete review"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* --- POP-UP REVIEW MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-8 border-b border-gray-50">
              <h3 className="text-2xl font-black text-gray-900">{isEditing ? 'Edit Your Review' : 'Rate this Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black transition p-2">
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-8 space-y-8">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Your Experience Rating</label>
                <div className="flex gap-3 text-4xl">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingValue(star)}
                      className={`transform transition-transform hover:scale-125 ${star <= ratingValue ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Detailed Feedback</label>
                <textarea 
                  className="w-full p-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all min-h-[150px] font-medium"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you like or dislike about this product?"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition"
                >
                  {isEditing ? 'Update Review' : 'Post Review'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black text-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetails;