import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const Home = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : null;
    const jwtToken = parsedToken ? parsedToken.token : null;

    useEffect(() => {
        const DataFetch = async () => {
            try {
                const response = await fetch("https://localhost:7223/api/Product/getAllProducts");

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const Data = await response.json();

                setProducts(Data);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
        DataFetch();
    }, []);

    const handleAddToCart = async (productId) => {
        if (jwtToken !== null) {
            const decodedToken = jwtDecode(jwtToken); // Decode the token
            const userId = decodedToken.nameid;

            const wData = await fetch("https://localhost:7223/api/Cart/createCart", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
                body: JSON.stringify({ userId, productId })
            });

            if (!wData.ok) {
                alert('Failed to save data');
                return;
            }

            const data = await wData.text();
            alert(data);
            navigate("/cart");
        } else {
            // Redirect the user to login and then to cart after login
            navigate("/login", { state: { from: "/cart" } });
        }
    };

    const handleBuyProduct = async (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>StockQuantity</th>
                        <th>Description</th>
                        <th>Photo</th>
                        <th>Rating</th>
                        <th>Buy Item?</th>
                        <th>Cart Item?</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) =>
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.productName}</td>
                            <td>{product.price}</td>
                            <td>{product.discount}</td>
                            <td>{product.stockQuantity}</td>
                            <td>{product.description}</td>
                            <td><img src={`data:image/jpeg;base64,${product.photoPath}`} alt={product.productName} /></td>
                            <td>{product.productRating === null ? "No rating yet" : product.productRating}</td>
                            <td><button onClick={() => handleBuyProduct(product.id)}>Buy Now</button></td>
                            <td><button onClick={() => handleAddToCart(product.id)}>Add To Cart</button></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default Home;
