// import './App.css';
// import { Outlet } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useEffect, useState } from 'react';
// import Context from './context';
// import { useDispatch } from 'react-redux';
// import { setUserDetails } from './store/userSlice';
// import { jwtDecode } from "jwt-decode";


// function App() {
//   const dispatch = useDispatch()
//   const [cartProductCount,setCartProductCount] = useState(0)
//   const token = localStorage.getItem('token');
//   const parsedToken = token ? JSON.parse(token) : null;
//   const jwtToken = parsedToken ? parsedToken.token : null;

//   // Decode the JWT token to get the user ID
//   const decodedToken = jwtDecode(jwtToken);
//   const userId = decodedToken.nameid;

//   const fetchUserDetails = async()=>{
//       // const dataResponse = await fetch(SummaryApi.current_user.url,{
//       //   method : SummaryApi.current_user.method,
//       //   credentials : 'include'
//       // })

//       // const dataApi = await dataResponse.json()

//       // if(dataApi.success){
//       //   dispatch(setUserDetails(dataApi.data))
//       // }
//   }

//   const fetchUserAddToCart = async () => {
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

//       const dataApi = await response.json();
//      setCartProductCount(dataApi?.data?.count)
//     } catch (error) {
//       console.error('Failed to fetch cart data:', error);
//     } 
//   };

//   useEffect(()=>{
//     /**user Details */
//     fetchUserDetails()
//     /**user Details cart product */
//     fetchUserAddToCart()

//   },[])
//   return (
//     <>
//       <Context.Provider value={{
//           fetchUserDetails, // user detail fetch 
//           cartProductCount, // current user add to cart product count,
//           fetchUserAddToCart
//       }}>
//         <ToastContainer 
//           position='top-center'
//         />
        
//         <Header/>
//         <main className='min-h-[calc(100vh-120px)] pt-16'>
//           <Outlet/>
//         </main>
//         <Footer/>
//       </Context.Provider>
//     </>
//   );
// }

// export default App;
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
import {jwtDecode} from 'jwt-decode'; // Correct the import here
function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);
  const token = localStorage.getItem('token');
  const parsedToken = token ? JSON.parse(token) : null;
  const jwtToken = parsedToken ? parsedToken.token : null;

  // Decode the JWT token to get the user ID
  const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
  const userId = decodedToken ? decodedToken.nameid : null;

    const fetchUserDetails = async()=>{
//       // const dataResponse = await fetch(SummaryApi.current_user.url,{
//       //   method : SummaryApi.current_user.method,
//       //   credentials : 'include'
//       // })

//       // const dataApi = await dataResponse.json()

//       // if(dataApi.success){
//       //   dispatch(setUserDetails(dataApi.data))
//       // }
  }


  const fetchUserAddToCart = async () => {
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
    fetchUserDetails();
    fetchUserAddToCart();
  }, []);

  return (
    <>
 <SignalRProvider>
      <Context.Provider value={{
        fetchUserDetails,
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

