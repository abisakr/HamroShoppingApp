import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import Context from './context';
import { SignalRProvider } from './context/SignalRContext'; 
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  const fetchUserAddToCart = async () => {
    try {
      const response = await fetch(`https://localhost:7223/api/Cart/getCartsByUserId`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensures cookies (JWT) are sent with the request
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart data');
      }

      const dataApi = await response.json();
      console.log('API response:', dataApi); // Log the entire response

      // Check if dataApi is an array and update cartProductCount accordingly
      if (Array.isArray(dataApi)) {
        setCartProductCount(dataApi.length);
      } else if (dataApi && dataApi.data) {
        setCartProductCount(dataApi.data.count || 0);
      } else {
        console.error('Unexpected response structure:', dataApi);
      }
    } catch (error) {
      console.error('Failed to fetch cart data:', error);
    }
  };

  useEffect(() => {
    fetchUserAddToCart();
  }, []);

  return (
    <>
      <SignalRProvider>
        <Context.Provider value={{
          cartProductCount,
          fetchUserAddToCart
        }}>
          <ToastContainer position='top-center' />
          <Header />
          <main className='min-h-[calc(100vh-120px)] pt-16'>
            <Outlet />
          </main>
          <Footer />
        </Context.Provider>
      </SignalRProvider>
    </>
  );
}

export default App;
