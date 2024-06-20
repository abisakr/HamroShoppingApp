import React, { useContext, useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);
  const jwtToken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI4OWMwOGZmMC0zYWI1LTQ5MjktOTdhOC02ZWQ3NDQ1ODI4YWIiLCJuYW1lIjoiQWJpc2thciIsIm5iZiI6MTcxODg5MTc0OSwiZXhwIjoxNzE4OTAyNTQ5LCJpYXQiOjE3MTg4OTE3NDksImlzcyI6Iklzc3VlciIsImF1ZCI6IkF1ZGllbmNlIn0.hWIsRnow1Fp9lvxt3HhkUd_t49rRDt1N8PbMC1pvOgNMHmyeoaRHmk0qLk8Gf8qa6cxGPl70K-wZlbOip5w9pA";
  const navigate = useNavigate();

  // Decode the JWT token to get the user ID
  const decodedToken = jwtDecode(jwtToken);
  const userId = decodedToken.nameid;

  // Function to fetch cart data
  const fetchCartData = async () => {
    try {
      const response = await fetch(`https://localhost:7223/api/Cart/getCartsByUserId`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
          'UserId': userId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart data');
      }

      const responseData = await response.json();
      setCartData(responseData);
    } catch (error) {
      console.error('Failed to fetch cart data:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  // Initial fetch of cart data on component mount
  useEffect(() => {
    setLoading(true);
    fetchCartData();
  }, []);

  // Function to increase quantity of a product in cart
  const increaseQty = async (id, qty) => {
    try {
      const response = await fetch(`https://localhost:7223/api/Cart/editCart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ quantity: qty + 1 })
      });

      const responseData = await response.json();
      if (!responseData.ok) {
        throw new Error('Failed to update quantity');
      }
      fetchCartData(); // Refresh cart data after successful update
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  // Function to decrease quantity of a product in cart
  const decreaseQty = async (id, qty) => {
    if (qty >= 2) {
      try {
        const response = await fetch(`https://localhost:7223/api/Cart/editCart/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify({ quantity: qty - 1 })
        });

        const responseData = await response.json();
        if (!responseData.ok) {
          throw new Error('Failed to update quantity');
        }
        fetchCartData(); // Refresh cart data after successful update
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    }
  };

  // Function to delete a product from cart
  const deleteCartProduct = async (id) => {
    try {
      const response = await fetch(`https://localhost:7223/api/Cart/deleteCart/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      const responseData = await response.text();
      if (!response.ok) {
        alert(responseData);
      } else {
        alert(responseData);
        fetchCartData(); // Refresh cart data after successful deletion
        context.fetchUserAddToCart(); // Update user's cart in global context if necessary
      }
    } catch (error) {
      console.error('Failed to delete product from cart:', error);
    }
  };

  // Function to handle placing an order
  const handlePlaceOrder = async () => {
    try {
      const products = cartData.map(cart => ({
        productId: cart.productId,
        quantity: cart.quantity,
        unitPrice: cart.price
      }));

      const response = await fetch(`https://localhost:7223/api/Order/createCartOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
          'UserId': userId
        },
        body: JSON.stringify(products)
      });

      const responseData = await response.text();
      if (!response.ok) {
        alert(responseData);
      } else {
        alert(responseData);
        setCartData([]); // Clear cart data after successful order placement
        navigate('/cart');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  // Calculate total quantity and total price of items in cart
  const totalQty = cartData.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
  const totalPrice = cartData.reduce((previousValue, currentValue) => previousValue + (currentValue.quantity * currentValue.price), 0);

  return (
    <div className='container mx-auto'>
      <div className='text-center text-lg my-3'>
        {cartData.length === 0 && !loading && (
          <p className='bg-white py-5'>No Data</p>
        )}
      </div>

      <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
        {/*** View products ***/}
        <div className='w-full max-w-3xl'>
          {loading ? (
            loadingCart?.map((el, index) => (
              <div key={`loading-${index}`} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'></div>
            ))
          ) : (
            cartData.map((product, index) => (
              <div key={product.id} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
                <div className='w-32 h-32 bg-slate-200'>
                  <img src={`data:image/jpeg;base64,${product.productPhoto}`} className='w-full h-full object-scale-down mix-blend-multiply' alt={`Product ${index}`} />
                </div>
                <div className='px-4 py-2 relative'>
                  {/*** Delete product ***/}
                  <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product.id)}>
                    <MdDelete />
                  </div>

                  <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product.productName}</h2>
                  <p className='capitalize text-slate-500'>{product.productName}</p>
                  <div className='flex items-center justify-between'>
                    <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product.price)}</p>
                    <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product.price * product.quantity)}</p>
                  </div>
                  <div className='flex items-center gap-3 mt-1'>
                    <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => decreaseQty(product.id, product.quantity)}>-</button>
                    <span>{product.quantity}</span>
                    <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => increaseQty(product.id, product.quantity)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/*** Summary ***/}
        <div className='mt-5 lg:mt-0 w-full max-w-sm'>
          {loading ? (
            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'></div>
          ) : (
            <div className='h-36 bg-white'>
              <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
              <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                <p>Quantity</p>
                <p>{totalQty}</p>
              </div>

              <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                <p>Total Price</p>
                <p>{displayINRCurrency(totalPrice)}</p>
              </div>

              <button onClick={handlePlaceOrder} className='bg-blue-600 p-2 text-white w-full mt-2'>Place Order</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
