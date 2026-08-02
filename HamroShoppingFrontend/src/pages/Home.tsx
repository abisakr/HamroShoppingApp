// src/pages/Home.tsx
import { useEffect, useState, useMemo } from 'react'
import { FaSearch, FaFire, FaFilter, FaRedoAlt, FaBoxOpen } from 'react-icons/fa'
import ProductCard from '../components/ProductCard'
import { Skeleton } from '../components/Skeleton'
import Pagination from '../components/Pagination'
import { productService, categoryService } from '../services/api'
import type { Product } from '../types'

const Home = () => {
  // Main Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isPopularLoading, setIsPopularLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter/Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [sortOrder, setSortOrder] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Initial Load: Popular Products and Categories
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [popResponse, catResponse] = await Promise.all([
          productService.getPopular(),
          categoryService.getAll()
        ]);
        const popData = Array.isArray(popResponse) ? popResponse : (popResponse?.$values || []);
        const catData = Array.isArray(catResponse) ? catResponse : (catResponse?.$values || []);
        setPopularProducts(popData);
        setCategories(catData);
      } catch (err: any) {
        console.error("Initial load error", err);
      } finally {
        setIsPopularLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Main Product Fetcher
  useEffect(() => {
    const fetchMainProducts = async () => {
      setIsLoading(true);
      setError(null); // Reset actual API error
      try {
        let data;
        if (searchQuery) {
          data = await productService.search(searchQuery);
        } else if (selectedCategoryName || sortOrder) {
          data = await productService.getFiltered(selectedCategoryName, sortOrder);
        } else {
          data = await productService.getAll();
        }

        const finalData = Array.isArray(data) ? data : (data?.$values || []);
        setProducts(finalData);
        setCurrentPage(1); 
      } catch (err: any) {
        // Only set error if API fails (Network error, 500, etc.)
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchMainProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategoryName, sortOrder]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategoryName("");
    setSortOrder("");
  };

  // Pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return products.slice(startIdx, startIdx + itemsPerPage);
  }, [products, currentPage]);

  return (
    <section className="bg-white min-h-screen pb-20">
      {/* --- HERO & SEARCH --- */}
      <div className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-6 tracking-tight">HamroShopping</h1>
          <div className="max-w-2xl mx-auto relative group">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-white pl-16 pr-6 py-5 rounded-2xl text-black font-bold shadow-2xl outline-none focus:ring-4 focus:ring-blue-300 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 space-y-16">
        
        {/* --- POPULAR SECTION --- */}
        {/* Show this if not searching, OR if searching and no results found */}
        {(!searchQuery || products.length === 0) && popularProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <FaFire className="text-red-500 text-2xl" />
              <h2 className="text-2xl font-black uppercase">Trending Products</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {isPopularLoading 
                ? [...Array(4)].map((_, i) => <Skeleton key={i} height="300px" className="rounded-3xl" />)
                : popularProducts.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)
              }
            </div>
          </div>
        )}

        {/* --- MAIN SECTION --- */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-3xl font-black">
              {searchQuery ? 'Search Results' : selectedCategoryName || 'All Products'}
            </h2>
            
            <div className="flex items-center gap-4">
              <select 
                className="bg-gray-50 border-2 border-gray-100 p-3 rounded-xl font-bold outline-none"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Sort: Default</option>
                <option value="a">Price: Low to High</option>
                <option value="d">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategoryName("")}
              className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition ${
                selectedCategoryName === "" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryName(cat.categoryName)}
                className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition ${
                  selectedCategoryName === cat.categoryName ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>

          {/* Main Content Logic */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => <Skeleton key={i} height="350px" className="rounded-3xl" />)}
            </div>
          ) : error ? (
            /* CASE 1: REAL API ERROR */
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                <FaBoxOpen size={40} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-900">No products found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  No products found matching <span className="text-blue-600 font-bold">"{searchQuery || selectedCategoryName}"</span>. 
                  Try a different search term or browse other categories.
                </p>
              </div>
              <button 
                onClick={clearFilters}
                className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg"
              >
                <FaRedoAlt /> Clear Search
              </button>
            </div>
          ) : products.length > 0 ? (
            /* CASE 2: SUCCESS WITH DATA */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          ) : (
            /* CASE 3: SUCCESS BUT NO PRODUCTS FOUND */
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                <FaBoxOpen size={40} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-900">No products found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  No products found matching <span className="text-blue-600 font-bold">"{searchQuery || selectedCategoryName}"</span>. 
                  Try a different search term or browse other categories.
                </p>
              </div>
              <button 
                onClick={clearFilters}
                className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg"
              >
                <FaRedoAlt /> Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Home;