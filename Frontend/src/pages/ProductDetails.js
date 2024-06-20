
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaStarHalf } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    categoryId : "" ,
    brandName: "",
    categoryName: "",
    images: [],
    description: "",
    price: ""
  });
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
  const [zoomImage, setZoomImage] = useState(false);
  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoading(true);

    try {
      const response = await fetch(`https://localhost:7223/api/Product/getProductById/${id}`);
      const dataResponse = await response.json();
      console.log("API Response:", dataResponse);

      setLoading(false);
      if (dataResponse && dataResponse.id) {
        // Convert the photoPath (base64) to an image URL
        const imageUrl = `data:image/jpeg;base64,${dataResponse.photoPath}`;
        dataResponse.images = [imageUrl]; // Assuming a single image, you may adjust based on actual response
        setData(dataResponse);
        setActiveImage(imageUrl);
      } else {
        console.error("Unexpected response structure:", dataResponse);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({ x, y });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
     fetchUserAddToCart();
    navigate("/cart");
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
        {/* Product Image */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>
          <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2'>
            <img 
              src={activeImage} 
              className='h-full w-full object-scale-down mix-blend-multiply' 
              onMouseMove={handleZoomImage} 
              onMouseLeave={handleLeaveImageZoom} 
            />
            {/* Product zoom */}
            {zoomImage && (
              <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0'>
                <div
                  className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150'
                  style={{
                    background: `url(${activeImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                  }}
                ></div>
              </div>
            )}
          </div>

          <div className='h-full'>
            {loading ? (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {productImageListLoading.map((el, index) => (
                  <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={"loadingImage" + index}></div>
                ))}
              </div>
            ) : (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {data?.images?.map((imgURL, index) => (
                  <div className='h-20 w-20 bg-slate-200 rounded p-1' key={imgURL}>
                    <img 
                      src={imgURL} 
                      className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' 
                      onMouseEnter={() => handleMouseEnterProduct(imgURL)}  
                      onClick={() => handleMouseEnterProduct(imgURL)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product details */}
        {loading ? (
          <div className='grid gap-1 w-full'>
            <p className='bg-slate-200 animate-pulse h-6 lg:h-8 w-full rounded-full inline-block'></p>
            <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8 bg-slate-200 animate-pulse w-full'></h2>
            <p className='capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8 w-full'></p>
            <div className='text-red-600 bg-slate-200 h-6 lg:h-8 animate-pulse flex items-center gap-1 w-full'></div>
            <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8 animate-pulse w-full'>
              <p className='text-red-600 bg-slate-200 w-full'></p>
              <p className='text-slate-400 line-through bg-slate-200 w-full'></p>
            </div>
            <div className='flex items-center gap-3 my-2 w-full'>
              <button className='h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full'></button>
              <button className='h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full'></button>
            </div>
            <div className='w-full'>
              <p className='text-slate-600 font-medium my-1 h-6 lg:h-8 bg-slate-200 rounded animate-pulse w-full'></p>
              <p className='bg-slate-200 rounded animate-pulse h-10 lg:h-12 w-full'></p>
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-1'>
            <p className='bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit'>{data?.categoryName}</p>
            <h2 className='text-2xl lg:text-4xl font-medium'>{data?.productName}</h2>
            <p className='capitalize text-slate-400'>{data?.categoryName}</p>
            <div className='text-red-600 flex items-center gap-1'>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalf />
              <p className='text-slate-600'>(50)</p>
            </div>
            <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
              <p className='text-red-600'>{displayINRCurrency(data?.price)}</p>
              <p className='text-slate-400 line-through'>{displayINRCurrency(data?.price + (data?.price / 10))}</p>
            </div>
            <div className='flex items-center gap-3 my-2'>
              <button className='bg-red-300 py-2 px-5 rounded text-red-700 font-medium hover:bg-red-400 transition-all' onClick={(e) => handleBuyProduct(e, id)}>Buy Now</button>
              <button className='bg-red-100 py-2 px-5 rounded text-red-700 font-medium hover:bg-red-200 transition-all' onClick={(e) => handleAddToCart(e, id)}>Add To Cart</button>
            </div>
            <div>
              <p className='text-slate-600 font-medium my-1'>Description</p>
              <p className='text-slate-600'>{data?.description}</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <CategroyWiseProductDisplay title={"Other similar products"} categoryId={1} />
      </div>
    </div>
  );
};

export default ProductDetails;