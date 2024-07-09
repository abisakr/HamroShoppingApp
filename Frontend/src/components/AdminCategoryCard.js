import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditCategory from './AdminEditCategory';

const AdminCategoryCard = ({
    data,
    fetchdata
}) => {
    const [editProduct,setEditProduct] = useState(false)

  return (
    <div className='bg-white p-4 rounded '>
       <div className='w-40'>
            <div className='w-32 h-32 flex justify-center items-center'>
              <img src={`data:image/jpeg;base64,${data.photoPath}`} className='mx-auto object-fill h-full'/>   
            </div> 
            <h1 className='text-ellipsis line-clamp-2 capitalize'>{data.categoryName}</h1>

            <div>
                <div className='w-fit ml-auto p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' onClick={()=>setEditProduct(true)}>
                    <MdModeEditOutline/>
                </div>
            </div>

          
       </div>
        
        {
          editProduct && (
            <AdminEditCategory productData={data} onClose={() =>setEditProduct(false)} fetchdata={fetchdata}/>
          )
        }
    
    </div>
  )
}

export default AdminCategoryCard