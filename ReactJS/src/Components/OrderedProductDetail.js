import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {jwtDecode} from 'jwt-decode';

const OrderedProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProductData = async () => {
      try {
        console.log(`Fetching product data for productId: ${id}`); // Debugging line

        const response = await fetch(`https://localhost:7223/api/Product/getProductById/${id}`, { method: 'GET' });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const initialQuantity = data.quantity || 1; // Set initial quantity to 1 if not provided
        setProduct({ ...data, quantity: initialQuantity });
        setTotalPrice(data.price * initialQuantity);
      } catch (error) {
        console.error('Failed to fetch data:', error.message); // More detailed error message
      }
    };

    fetchProductData();
  }, [navigate, id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;

    setProduct((prevProduct) => {
      const updatedProduct = { ...prevProduct, quantity: newQuantity };
      setTotalPrice(updatedProduct.price * newQuantity);
      return updatedProduct;
    });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const PlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.nameid;

      const orderDetails = {
        productId: product.id,
        quantity: product.quantity,
        unitPrice: product.price
      };

      const response = await fetch(`https://localhost:7223/api/Order/createDirectOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'UserId': userId
        },
        body: JSON.stringify([orderDetails]) // assuming the endpoint expects an array of products
      });

      const data = await response.text();
      if (!response.ok) {
        alert(data);
      } else {
        alert(data);
        setProduct(null);
        setTotalPrice(0);
        navigate('/'); // navigate to home or any other page
      }
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Photo</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr key={product.id}>
            <td>{product.productName}</td>
            <td><img src={product.productPhoto} alt="pic" /></td>
            <td>
              <button onClick={() => handleQuantityChange(product.quantity - 1)}><RemoveIcon /></button>
              <span>{product.quantity}</span>
              <button onClick={() => handleQuantityChange(product.quantity + 1)}><AddIcon /></button>
            </td>
            <td>{product.price}</td>
          </tr>
          <tr>
            <td colSpan="3">Total Price:</td>
            <td>{totalPrice}</td>
          </tr>
          <tr>
            <td colSpan="4">
              <button onClick={PlaceOrder}>Order</button>
            </td>
          </tr>
        </tbody>
      </table>
      <Link to="/">Back</Link>
    </>
  );
};

export default OrderedProductDetail;
