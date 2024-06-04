import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import {jwtDecode} from "jwt-decode";
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const MyCart = () => {
  const [mycarts, setMycarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return;
    }

    const CartData = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.nameid;

        const wData = await fetch("https://localhost:7223/api/Cart/getCartsByUserId", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'UserId': userId
          },
        });

        if (!wData.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await wData.json();
        setMycarts(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    CartData();
  }, [navigate]);

  useEffect(() => {
    const totalPrice = mycarts.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotalPrice(totalPrice);
  }, [mycarts]);

  const handleQuantityChange = async (id, newQuantity) => {
    try {
      const wData = await fetch(`https://localhost:7223/api/Cart/editCart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!wData.ok) {
        throw new Error('Failed to update quantity');
      }

      setMycarts(prevCarts => prevCarts.map(cart => cart.id === id ? { ...cart, quantity: newQuantity } : cart));
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  }

  const DeleteCart = async (id) => {
    try {
      const wData = await fetch(`https://localhost:7223/api/Cart/deleteCart/${id}`, {
        method: 'DELETE',
      });

      const data = await wData.text();
      if (!wData.ok) {
        alert(data);
      } else {
        alert(data);
        setMycarts(prevCarts => prevCarts.filter(cart => cart.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete data:', error);
    }
  }

  const PlaceCartsOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.nameid;

      const products = mycarts.map(cart => ({
        productId: cart.productId,
        quantity: cart.quantity,
        unitPrice: cart.price
      }));

      const wData = await fetch(`https://localhost:7223/api/Order/createCartOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'UserId': userId
        },
        body: JSON.stringify(products)
      });

      const data = await wData.text();
      if (!wData.ok) {
        alert(data);
      } else {
        alert(data);
        setMycarts([]);
        setTotalPrice(0);
      navigate('/');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  }

  return (
    <RequireAuth>
      <>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Photo</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {mycarts.map((cart) =>         
              <tr key={cart.id}>
                <td>{cart.productName}</td>

                <td><img src={`data:image/jpeg;base64,${cart.productPhoto}`} alt={cart.productName} /></td>
     
                <td>
                  <button onClick={() => handleQuantityChange(cart.id, cart.quantity - 1)}><RemoveIcon/></button>
                  <span>{cart.quantity}</span>
                  <button onClick={() => handleQuantityChange(cart.id, cart.quantity + 1)}><AddIcon/></button>
                </td>
                <td>{cart.price}</td>
                <td>
                  <button onClick={() => DeleteCart(cart.id)}><ClearIcon/></button>
                </td>
              </tr>
            )}
            <tr>
              <td colSpan="4">Total Price :</td>
              <td>{totalPrice}</td>
            </tr>
        <button onClick={PlaceCartsOrder}>Order</button>
          </tbody>
        </table>
    
        <Link to="/">Back</Link>
      </>
    </RequireAuth>
  );
}

export default MyCart;
