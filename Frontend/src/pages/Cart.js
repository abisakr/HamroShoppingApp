import React, { useContext, useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { useSignalR } from '../context/SignalRContext';

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const { sendNotification } = useSignalR();

  useEffect(() => {
    setLoading(true);
    fetchCartData();

    if (localStorage.getItem('showToast') === 'true') {
      toast.success("Order Placed.");
      localStorage.removeItem('showToast');
    }
  }, []);

  const fetchCartData = async () => {
    try {
      const response = await fetch(`https://localhost:7223/api/Cart/getCartsByUserId`, {
        method: 'GET',
        credentials: 'include', // 👈 send cookies
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch cart data');

      const data = await response.json();
      setCartData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (id, qty) => {
    try {
      const response = await fetch(`https://localhost:7223/api/Cart/editCart/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: qty + 1 })
      });

      if (!response.ok) throw new Error('Failed to update quantity');
      fetchCartData();
    } catch (error) {
      console.error(error);
    }
  };

  const decreaseQty = async (id, qty) => {
    if (qty >= 2) {
      try {
        const response = await fetch(`https://localhost:7223/api/Cart/editCart/${id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity: qty - 1 })
        });

        if (!response.ok) throw new Error('Failed to update quantity');
        fetchCartData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteCartProduct = async (id) => {
    try {
      const response = await fetch(`https://localhost:7223/api/Cart/deleteCart/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const message = await response.text();
      if (!response.ok) return toast.error(message);

      toast.success(message);
      fetchCartData();
      context.fetchUserAddToCart();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const products = cartData.map(cart => ({
        productId: cart.productId,
        quantity: cart.quantity,
        unitPrice: cart.price
      }));

      const response = await fetch(`https://localhost:7223/api/Order/createCartOrder`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(products)
      });

      const message = await response.text();
      if (!response.ok) return toast.error(message);

      sendNotification("Customer", "Order Alert !!");
      setCartData([]);
      navigate('/cart');

      // Prepare for eSewa
      const totalAmount = totalPrice + 10;
      const transactionUuid = uuidv4();
      const messageToSign = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=EPAYTEST`;
      const secret = '8gBm/:&EnhH.1/q';
      const hash = CryptoJS.HmacSHA256(messageToSign, secret);
      const signature = CryptoJS.enc.Base64.stringify(hash);

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

      inputs.forEach(({ name, value }) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      localStorage.setItem('showToast', 'true');
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error(error);
    }
  };

  const totalQty = cartData.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartData.reduce((sum, item) => sum + item.quantity * item.price, 0);

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
