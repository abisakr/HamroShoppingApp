import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const auth = localStorage.getItem('token'); // Check if the token exists in storage

  if (!auth) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // If authenticated, render the children
};
export default RequireAuth;



// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useEffect, useState } from 'react';

// const RequireAuth = ({ children }) => {
//   const location = useLocation();
//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setIsAuthenticated(false);
//     } else {
//       fetch('/api/validate-token', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })
//       .then(response => {
//         if (response.ok) setIsAuthenticated(true);
//         else throw new Error('Token validation failed');
//       })
//       .catch(error => {
//         console.error('Authentication error:', error);
//         setIsAuthenticated(false);
//       });
//     }
//   }, []);

//   if (isAuthenticated === null) {
//     return <div>Loading...</div>; // or some loading spinner
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default RequireAuth;
