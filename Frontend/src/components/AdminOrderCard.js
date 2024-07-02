import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditCategory from './AdminEditCategory';

const AdminOrderCard = ({
    data,
    fetchdata
}) => {
    const [editProduct,setEditProduct] = useState(false)

  return (
    <div className='bg-white p-4 rounded '>
       <div className='w-60'>
            <div className='w-32 h-32 flex justify-center items-center  '>
              <img src={`data:image/jpeg;base64,${data.photoPath}`} className='mx-auto object-fill h-full'/>   
            </div> 
            <h1 className='text-ellipsis line-clamp-2 capitalize'>Category: {data.categoryName}</h1>
            <h1 className='text-ellipsis line-clamp-2 capitalize'>Product: {data.productName||"product"}</h1>
            <h1 className='text-ellipsis line-clamp-2 capitalize'>Costumer Name: {data.fullName}</h1>
            <h1 className='text-ellipsis line-clamp-2 capitalize'>Delivery Address: {data.address}</h1>
            <h1 className='text-ellipsis line-clamp-2 capitalize'>Phone Number: {data.phoneNumber}</h1>
            <h1 className='text-ellipsis line-clamp-2 capitalize'>Quantity: {data.quantity}</h1>
            <h1 className='text-ellipsis line-clamp-2 capitalize'>TotalPrice: {data.totalPrice}</h1>
            
            <div>
                <div className='w-fit ml-auto p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' onClick={()=>setEditProduct(true)}>
                    <MdModeEditOutline/>
                </div>
            </div>

          
       </div>
        
        {
          editProduct && (
            <AdminEditCategory productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchdata}/>
          )
        }
    
    </div>
  )
}

export default AdminOrderCard