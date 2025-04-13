import React, { useEffect, useState } from 'react';
import AdminOrderCard from '../components/AdminOrderCard';
import UploadCategory from '../components/UploadCategory';

const Orders = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const fetchAllCategories = async () => {
    try {
      // Make the API call with credentials to include cookies (JWT in cookies)
      const response = await fetch("https://localhost:7223/api/Order/getAllOrder", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This sends the JWT stored in the cookies automatically
      });

      if (response.ok) {
        const dataResponse = await response.json();
        setAllProduct(dataResponse);
      } else {
        console.error('Failed to fetch orders:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>Customer Orders</h2>
      </div>

      {/* Display all orders */}
      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {
          allProduct.map((order, index) => (
            <AdminOrderCard data={order} key={index + "allOrder"} fetchdata={fetchAllCategories} />
          ))
        }
      </div>

      {/**upload category component */}
      {
        openUploadCategory && (
          <UploadCategory onClose={() => setOpenUploadCategory(false)} fetchData={fetchAllCategories} />
        )
      }
    </div>
  );
};

export default Orders;
