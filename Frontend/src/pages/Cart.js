// import React, { useContext, useEffect, useState } from 'react';
// import { MdDelete } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";
// import Context from '../context';
// import displayINRCurrency from '../helpers/displayCurrency';
// import { toast } from 'react-toastify';
// import CryptoJS from 'crypto-js';
// const Cart = () => {
//   const [cartData, setCartData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const context = useContext(Context);
//   const loadingCart = new Array(4).fill(null);
//   const navigate = useNavigate();

//   const token = localStorage.getItem('token');
//   const parsedToken = token ? JSON.parse(token) : null;
//   const jwtToken = parsedToken ? parsedToken.token : null;

//   // Decode the JWT token to get the user ID
//   const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
//   const userId = decodedToken ? decodedToken.nameid : null;

//   // Function to fetch cart data
//   const fetchCartData = async () => {
//     if (!jwtToken || !userId) {
//       console.error('Missing JWT token or user ID');
//       return;
//     }

//     try {
//       const response = await fetch(`https://localhost:7223/api/Cart/getCartsByUserId`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${jwtToken}`,
//           'UserId': userId
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch cart data');
//       }

//       const responseData = await response.json();
//       console.log('API response:', responseData); // Log the entire response
//       setCartData(responseData);
//     } catch (error) {
//       console.error('Failed to fetch cart data:', error);
//     } finally {
//       setLoading(false); // Set loading to false after fetching data
//     }
//   };

//   // Initial fetch of cart data on component mount
//   useEffect(() => {
//     setLoading(true);
//     fetchCartData();
//   }, []);

//   // Function to increase quantity of a product in cart
//   const increaseQty = async (id, qty) => {
//     try {
//       const response = await fetch(`https://localhost:7223/api/Cart/editCart/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${jwtToken}`
//         },
//         body: JSON.stringify({ quantity: qty + 1 })
//       });

//       const responseData = await response.json();
//       if (!responseData.ok) {
//         throw new Error('Failed to update quantity');
//       }
//       fetchCartData(); // Refresh cart data after successful update
//     } catch (error) {
//       console.error('Failed to update quantity:', error);
//     }
//   };

//   // Function to decrease quantity of a product in cart
//   const decreaseQty = async (id, qty) => {
//     if (qty >= 2) {
//       try {
//         const response = await fetch(`https://localhost:7223/api/Cart/editCart/${id}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${jwtToken}`
//           },
//           body: JSON.stringify({ quantity: qty - 1 })
//         });

//         const responseData = await response.json();
//         if (!responseData.ok) {
//           throw new Error('Failed to update quantity');
//         }else{
//           fetchCartData(); // Refresh cart data after successful update

//         }
//       } catch (error) {
//         console.error('Failed to update quantity:', error);
//       }
//     }
//   };

//   // Function to delete a product from cart
//   const deleteCartProduct = async (id) => {
//     try {
//       const response = await fetch(`https://localhost:7223/api/Cart/deleteCart/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${jwtToken}`
//         }
//       });

//       const responseData = await response.text();
//       if (!response.ok) {
//         alert(responseData);
//       } else {
//         toast.success(responseData);
//         fetchCartData(); // Refresh cart data after successful deletion
//         context.fetchUserAddToCart(); // Update user's cart in global context if necessary
//       }
//     } catch (error) {
//       console.error('Failed to delete product from cart:', error);
//     }
//   };

//   // Function to handle placing an order
//   // const handlePlaceOrder = async () => {
//   //   try {
//   //     const products = cartData.map(cart => ({
//   //       productId: cart.productId,
//   //       quantity: cart.quantity,
//   //       unitPrice: cart.price
//   //     }));

//   //     const response = await fetch(`https://localhost:7223/api/Order/createCartOrder`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         'Authorization': `Bearer ${jwtToken}`,
//   //         'UserId': userId
//   //       },
//   //       body: JSON.stringify(products)
//   //     });

//   //     const responseData = await response.text();
//   //     if (!response.ok) {
//   //       toast.error(responseData);
//   //     } else {
//   //       toast.success("Order Placed.");
//   //       setCartData([]); // Clear cart data after successful order placement
//   //       navigate('/cart');
//   //     }
//   //   } catch (error) {
//   //     console.error('Failed to place order:', error);
//   //   }
//   // };
//   const handlePlaceOrder = async () => {
//     try {
//       const products = cartData.map(cart => ({
//         productId: cart.productId,
//         quantity: cart.quantity,
//         unitPrice: cart.price
//       }));
  
//       const transactionUUID = "gagr56";
//       const totalAmount = totalPrice + 10; // Adding a fixed tax amount of 10 as an example
  
//       // Create order in your backend first
//       const response = await fetch(`https://localhost:7223/api/Order/createCartOrder`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${jwtToken}`,
//           'UserId': userId
//         },
//         body: JSON.stringify(products)
//       });
  
//       const responseData = await response.text();
//       if (!response.ok) {
//         toast.error(responseData);
//       } else 
//       {
  
//         // Dynamically create and submit the eSewa form
//         const form = document.createElement('form');
//         form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
//         form.method = 'POST';
  
//         form.innerHTML = `
//           <input type="text" name="amount" value="${totalPrice}" required>
//           <input type="text" name="tax_amount" value="10" required>
//           <input type="text" name="total_amount" value="${totalAmount}" required>
//           <input type="text" name="transaction_uuid" value="${transactionUUID}" required>
//           <input type="text" name="product_code" value="EPAYTEST" required>
//           <input type="text" name="product_service_charge" value="0" required>
//           <input type="text" name="product_delivery_charge" value="0" required>
//           <input type="text" name="success_url" value="https://esewa.com.np" required>
//           <input type="text" name="failure_url" value="https://google.com" required>
//           <input type="text" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required>
//           <input type="text" name="signature" value="your_signature_here" required>
//         `;
  
//         document.body.appendChild(form);
//         form.submit();
  
//         // Clear cart data after successful order placement
//         toast.success("Order Placed.");
//         setCartData([]);
//         navigate('/cart');
//       }
//     } catch (error) {
//       console.error('Failed to place order:', error);
//     }
//   };
  


//   // Calculate total quantity and total price of items in cart
//   const totalQty = cartData.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
//   const totalPrice = cartData.reduce((previousValue, currentValue) => previousValue + (currentValue.quantity * currentValue.price), 0);

//   return (
//     <div className='container mx-auto'>
//       <div className='text-center text-lg my-3'>
//         {cartData.length === 0 && !loading && (
//           <p className='bg-white py-5'>No Data</p>
//         )}
//       </div>

//       <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
//         {/*** View products ***/}
//         <div className='w-full max-w-3xl'>
//           {loading ? (
//             loadingCart?.map((el, index) => (
//               <div key={`loading-${index}`} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'></div>
//             ))
//           ) : (
//             cartData.map((product, index) => (
//               <div key={product.id} className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'>
//                 <div className='w-32 h-32 bg-slate-200'>
//                   <img src={`data:image/jpeg;base64,${product.productPhoto}`} className='w-full h-full object-scale-down mix-blend-multiply' alt={`Product ${index}`} />
//                 </div>
//                 <div className='px-4 py-2 relative'>
//                   {/*** Delete product ***/}
//                   <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={() => deleteCartProduct(product.id)}>
//                     <MdDelete />
//                   </div>

//                   <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product.productName}</h2>
//                   <p className='capitalize text-slate-500'>{product.productName}</p>
//                   <div className='flex items-center justify-between'>
//                     <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product.price)}</p>
//                     <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product.price * product.quantity)}</p>
//                   </div>
//                   <div className='flex items-center gap-3 mt-1'>
//                     <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => decreaseQty(product.id, product.quantity)}>-</button>
//                     <span>{product.quantity}</span>
//                     <button className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded' onClick={() => increaseQty(product.id, product.quantity)}>+</button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/*** Summary ***/}
//         <div className='mt-5 lg:mt-0 w-full max-w-sm'>
//           {loading ? (
//             <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'></div>
//           ) : (
//             <div className='h-36 bg-white'>
//               <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
//               <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
//                 <p>Quantity</p>
//                 <p>{totalQty}</p>
//               </div>

//               <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
//                 <p>Total Price</p>
//                 <p>{displayINRCurrency(totalPrice)}</p>
//               </div>

//               <button onClick={handlePlaceOrder} className='bg-blue-600 p-2 text-white w-full mt-2'>Place Order</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
import React, { useContext, useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const parsedToken = token ? JSON.parse(token) : null;
  const jwtToken = parsedToken ? parsedToken.token : null;

  // Decode the JWT token to get the user ID
  const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
  const userId = decodedToken ? decodedToken.nameid : null;
  
  useEffect(() => {
    setLoading(true);
    fetchCartData();

    // Check for the toast flag in localStorage
    const showToast = localStorage.getItem('showToast');
    if (showToast === 'true') {
      toast.success("Order Placed.");
      localStorage.removeItem('showToast');
    }
  }, []);
  // Function to fetch cart data
  const fetchCartData = async () => {
    if (!jwtToken || !userId) {
      console.error('Missing JWT token or user ID');
      return;
    }

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
      console.log('API response:', responseData); // Log the entire response
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
        } else {
          fetchCartData(); // Refresh cart data after successful update
        }
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
        toast.success(responseData);
        fetchCartData(); // Refresh cart data after successful deletion
        context.fetchUserAddToCart(); // Update user's cart in global context if necessary
      }
    } catch (error) {
      console.error('Failed to delete product from cart:', error);
    }
  };

  // Function to handle placing an order and redirect to eSewa
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
        toast.error(responseData);
      } else {
        setCartData([]); // Clear cart data after successful order placement
        navigate('/cart');

        // Generate signature for eSewa
        const totalAmount = totalPrice + 10; // Assuming a fixed tax amount of 10 for this example
        const transactionUuid = uuidv4();// Generate this based on your logic
        const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=EPAYTEST`;
        const secret = '8gBm/:&EnhH.1/q';
        const hash = CryptoJS.HmacSHA256(message, secret);
        const signature = CryptoJS.enc.Base64.stringify(hash);

        // Redirect to eSewa
        const form = document.createElement('form');
        form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
        form.method = 'POST';

        const inputs = [
          { name: 'amount', value: totalPrice },
          { name: 'tax_amount', value: 10 },
          { name: 'total_amount', value: totalAmount },
          { name: 'transaction_uuid', value: transactionUuid },
          { name: 'product_code', value: 'EPAYTEST' },
          { name: 'product_service_charge', value: 0 },
          { name: 'product_delivery_charge', value: 0 },
          { name: 'success_url', value: 'http://localhost:3000/cart' },
          { name: 'failure_url', value: 'http://localhost:3000/cart' },
          { name: 'signed_field_names', value: 'total_amount,transaction_uuid,product_code' },
          { name: 'signature', value: signature }
        ];

        inputs.forEach(inputData => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = inputData.name;
          input.value = inputData.value;
          form.appendChild(input);
        });
        localStorage.setItem('showToast', 'true');
        document.body.appendChild(form);
        form.submit();
       // toast.success("Order Placed.");

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
