import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const CategoryList = () => {
    const [categoryProduct,setCategoryProduct] = useState([])
    const [loading,setLoading] = useState(false)

    const categoryLoading = new Array(13).fill(null)

    const fetchCategoryProduct = async() =>{
        setLoading(true)
        
        const response = await fetch("https://localhost:7223/api/Category/getAllCategory");            
         const dataResponse = await response.json();
        setLoading(false)
        setCategoryProduct(dataResponse)
    }

    useEffect(()=>{
        try {
            fetchCategoryProduct()
        } catch (error) {
        console.error('Error fetching data:', error.message);
    }
    },[])

  return (
    <div className='container mx-auto p-4'>
           <div className='flex items-center gap-4 justify-between overflow-scroll scrollbar-none'>
            {

                loading ? (
                    categoryLoading.map((el,index)=>{
                            return(
                                <div className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse' key={"categoryLoading"+index}>
                                </div>
                            )
                    })  
                ) :
                (
                    categoryProduct.map((product)=>{
                        return(
                            <Link to={"/product-category?category="+product?.id} className='cursor-pointer' key={product?.id}>
                                <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                                
                                <img src={`data:image/jpeg;base64,${product?.photoPath}`} alt={product?.categoryName} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all' />
                                   
                                </div>
                                <p className='text-center text-sm md:text-base capitalize'>{product?.categoryName}</p>
                            </Link>
                        )
                    })
                )
            }
           </div>
    </div>
  )
}

export default CategoryList