import React, { useEffect, useState } from 'react'
import AdminOrderCard from '../components/AdminOrderCard'
import UploadCategory from '../components/UploadCategory' 
import {jwtDecode} from "jwt-decode";

const Orders = () => {
  const [openUploadCategory,setOpenUploadCategory] = useState(false)
  const [allProduct,setAllProduct] = useState([])
  const token = localStorage.getItem('token');
  const parsedToken = token ? JSON.parse(token) : null;
  const jwtToken = parsedToken ? parsedToken.token : null;

  // Decode the JWT token to get the user ID
  const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
  const userId = decodedToken ? decodedToken.nameid : null;
  const fetchAllCategories = async () => {
    try {
        const response = await fetch("https://localhost:7223/api/Order/getAllOrder", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
            'UserId': userId
          }
        });
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
            <h2 className='font-bold text-lg'>Costumer Orders</h2>
                       
        </div>

        {/**all product */}
        <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
          {
            allProduct.map((product,index)=>{
              return(
                <AdminOrderCard data={product} key={index+"allProduct"} fetchdata={fetchAllCategories}/>
                
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

export default Orders



