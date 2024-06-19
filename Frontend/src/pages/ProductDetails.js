import React, { useCallback, useContext, useEffect, useState } from 'react'
import  { useNavigate, useParams } from 'react-router-dom'
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
// import VerticalCardProduct from '../components/VerticalCardProduct';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import {jwtDecode} from "jwt-decode";

const ProductDetails = () => {
  const [data,setData] = useState({
    productName : "",
    brandName : "",
    categoryName : "",
    photoPath : [],
    description : "",
    price : "",
    price : ""
  })
  const params = useParams()
  const [loading,setLoading] = useState(true)
  const productImageListLoading = new Array(4).fill(null)
  const [activeImage,setActiveImage] = useState("")

  const [zoomImageCoordinate,setZoomImageCoordinate] = useState({
    x : 0,
    y : 0
  })
  const [zoomImage,setZoomImage] = useState(false)

  const { fetchUserAddToCart } = useContext(Context)

  const navigate = useNavigate()

  const fetchProductDetails = async()=>{
    setLoading(true)
  
    const jwtToken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI4OWMwOGZmMC0zYWI1LTQ5MjktOTdhOC02ZWQ3NDQ1ODI4YWIiLCJuYW1lIjoiQWJpc2thciIsIm5iZiI6MTcxODczMDIxMCwiZXhwIjoxNzE4NzQxMDEwLCJpYXQiOjE3MTg3MzAyMTAsImlzcyI6Iklzc3VlciIsImF1ZCI6IkF1ZGllbmNlIn0.2_-TarxkYl4cfGOqIZ2fh2Ux1i0GDetFg8Kjz8fxy-O5knjJFkMhhei_ksgLYfd6aI4Za-gsadgEgVu0Vc_mJw"

    const decodedToken = jwtDecode(jwtToken); // Decode the token
    const id = decodedToken.nameid;

    const response = await fetch(`https://localhost:7223/api/Product/getProductById/${id}`, { method: 'GET' });

    //herere
    setLoading(false)
    const dataReponse = await response.json()

    setData(dataReponse?.data)
    setActiveImage(dataReponse?.data?.photoPath[0])
  }

  console.log("data",data)

  useEffect(()=>{
    fetchProductDetails()
  },[params])

  const handleMouseEnterProduct = (imageURL)=>{
    setActiveImage(imageURL)
  }

  const handleZoomImage = useCallback((e) =>{
    setZoomImage(true)
    const { left , top, width , height } = e.target.getBoundingClientRect()
    console.log("coordinate", left, top , width , height)

    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    setZoomImageCoordinate({
      x,
      y
    })
  },[zoomImageCoordinate])

  const handleLeaveImageZoom = ()=>{
    setZoomImage(false)
  }


  const handleAddToCart = async(e,id) =>{
    await addToCart(e,id)
    fetchUserAddToCart()
  }

  const handleBuyProduct = async(e,id)=>{
    await addToCart(e,id)
    fetchUserAddToCart()
    navigate("/cart")

  }

  return (
    <div className='container mx-auto p-4'>

      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
          {/***product Image */}
          <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>

              <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2'>
                  <img src={activeImage} className='h-full w-full object-scale-down mix-blend-multiply' onMouseMove={handleZoomImage} onMouseLeave={handleLeaveImageZoom}/>

                    {/**product zoom */}
                    {
                      zoomImage && (
                        <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0'>
                          <div
                            className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150'
                            style={{
                              background : `url(${activeImage})`,
                              backgroundRepeat : 'no-repeat',
                              backgroundPosition : `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}% `
    
                            }}
                          >
    
                          </div>
                        </div>
                      )
                    }
                  
              </div>

              <div className='h-full'>
                  {
                    loading ? (
                      <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                        {
                          productImageListLoading.map((el,index) =>{
                            return(
                              <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={"loadingImage"+index}>
                              </div>
                            )
                          })
                        }
                      </div>
                      
                    ) : (
                      <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                        {
                          /* data?.productImage?.map((imgURL,index) =>{ */
                          data?.photoPath?.map((imgURL,index) =>{
                            return(
                              <div className='h-20 w-20 bg-slate-200 rounded p-1' key={imgURL}>
                                <img src={imgURL} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={()=>handleMouseEnterProduct(imgURL)}  onClick={()=>handleMouseEnterProduct(imgURL)}/>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  }
              </div>
          </div>

           {/***product details */}
           {
            loading ? (
              <div className='grid gap-1 w-full'>
                <p className='bg-slate-200 animate-pulse  h-6 lg:h-8 w-full rounded-full inline-block'></p>
                <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8  bg-slate-200 animate-pulse w-full'></h2>
                <p className='capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8  w-full'></p>

                <div className='text-red-600 bg-slate-200 h-6 lg:h-8  animate-pulse flex items-center gap-1 w-full'>
    
                </div>

                <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8  animate-pulse w-full'>
                  <p className='text-red-600 bg-slate-200 w-full'></p>
                  <p className='text-slate-400 line-through bg-slate-200 w-full'></p>
                </div>

                <div className='flex items-center gap-3 my-2 w-full'>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                </div>

                <div className='w-full'>
                  <p className='text-slate-600 font-medium my-1 h-6 lg:h-8   bg-slate-200 rounded animate-pulse w-full'></p>
                  <p className=' bg-slate-200 rounded animate-pulse h-10 lg:h-12  w-full'></p>
                </div>
              </div>
            ) : 
            (
              <div className='flex flex-col gap-1'>
                <p className='bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit'>{data?.brandName}</p>
                <h2 className='text-2xl lg:text-4xl font-medium'>{data?.productName}</h2>
                <p className='capitalize text-slate-400'>{data?.categoryName}</p>

                <div className='text-red-600 flex items-center gap-1'>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStarHalf/>
                </div>

                <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
                  <p className='text-red-600'>{displayINRCurrency(data.price)}</p>
                  <p className='text-slate-400 line-through'>{displayINRCurrency(data.price)}</p>
                </div>

                <div className='flex items-center gap-3 my-2'>
                  <button className='border-2 border-red-600 rounded px-3 py-1 min-w-[120px] text-red-600 font-medium hover:bg-red-600 hover:text-white' onClick={(e)=>handleBuyProduct(e,data?.id)}>Buy</button>
                  <button className='border-2 border-red-600 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-red-600 hover:text-red-600 hover:bg-white' onClick={(e)=>handleAddToCart(e,data?.id)}>Add To Cart</button>
                </div>

                <div>
                  <p className='text-slate-600 font-medium my-1'>Description : </p>
                  <p>{data?.description}</p>
                </div>
              </div>
            )
           }

      </div>



      {
        data.category && (
          <CategroyWiseProductDisplay category={data?.category} heading={"Recommended Product"}/>
        )
      }
     



    </div>
  )
}

export default ProductDetails