import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import { jwtDecode } from "jwt-decode";
import ClearIcon from '@mui/icons-material/Clear';
const Successful = () => {
  const [mycarts, setMycarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Navigate to login if token doesn't exist
      navigate("/login");
      return; // Exit early
    }

    const CartData = async () => {
      try {
       
       const decodedToken = jwtDecode(token); // Decode the token
  const userId = decodedToken.nameid; 
  //   var userId="8c23792b-3f0b-42af-97a5-ba96604bd33c";
        const wData = await fetch("https://localhost:7223/api/Cart/getCartsByUserId",{
          method:'GET',
          headers:{'Content-Type':'application/json','UserId':userId},      
      });
        

        if (!wData.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await wData.json();
        setMycarts(data);
        const totalPrice = data.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotalPrice(totalPrice);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    CartData();
  }, [navigate]);

  const DeleteCart = async (id) => {
    try {
      const wData = await fetch(`https://localhost:7223/api/Cart/deleteCart/${id}`, {
        method: 'DELETE',});
      
      const data = await wData.text();
      if (!wData.ok) {
        alert(data);
      }else{
      alert(data);
      setMycarts(prevCarts => prevCarts.filter(cart => cart.id !== id));
      setTotalPrice("");
      }
      
    } catch (error) {
      console.error('Failed to delete data:', error);
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
                <td><img src={cart.productPhoto} alt="pic" /> </td>
                <td>{cart.quantity}</td>
                <td>{cart.price}</td>
                <td> <button onClick={() => DeleteCart(cart.id)}><ClearIcon/></button>  </td>
               
              </tr>
            
            )}
            <tr>
              <td colSpan="3">Total Price :</td>
              <td>{totalPrice}</td>
            </tr>
          </tbody>
        </table>
        <Link to="/">Back</Link>
      </>
    </RequireAuth>
  );
}

export default Successful;
