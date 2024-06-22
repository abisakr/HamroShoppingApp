import React, { useEffect, useState } from 'react'
import AdminCategoryCard from '../components/AdminCategoryCard'
import UploadCategory from '../components/UploadCategory' 

const AllCategories = () => {
  const [openUploadCategory,setOpenUploadCategory] = useState(false)
  const [allProduct,setAllProduct] = useState([])

  const fetchAllCategories = async () => {
    try {
        const response = await fetch("https://localhost:7223/api/Category/getAllCategory");
      const dataResponse = await response.json();
      setAllProduct(dataResponse);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } 
  };


  useEffect(()=>{
    fetchAllCategories()
  },[])
  
  return (
    <div>
    
        <div className='bg-white py-2 px-4 flex justify-between items-center'>
            <h2 className='font-bold text-lg'>All Categories</h2>
            
            <button  className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full ' onClick={()=>setOpenUploadCategory(true)}>Upload Category</button>
        </div>

        {/**all product */}
        <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
          {
            allProduct.map((product,index)=>{
              return(
                <AdminCategoryCard data={product} key={index+"allProduct"} fetchdata={fetchAllCategories}/>
                
              )
            })
          }
        </div>

        {/**upload prouct component */}
        {
          openUploadCategory && (
            <UploadCategory onClose={()=>setOpenUploadCategory(false)} fetchData={fetchAllCategories}/>
          )
        }
      

    </div>
  )
}

export default AllCategories



