// // import React from 'react'
// // import CategoryList from '../components/CategoryList'
// // import BannerProduct from '../components/BannerProduct'
// // import HorizontalCardProduct from '../components/HorizontalCardProduct'
// // import VerticalCardProduct from '../components/VerticalCardProduct'

// // const Home = () => {
  
// //   return (
// //     <div>
// //       <CategoryList/>
// //       <BannerProduct/>

// //       <HorizontalCardProduct category={"airpodes"} heading={"Top's Airpodes"}/>
// //       <HorizontalCardProduct category={"watches"} heading={"Popular's Watches"}/>

// //       <VerticalCardProduct category={"mobiles"} heading={"Mobiles"}/>
// //       <VerticalCardProduct category={"Mouse"} heading={"Mouse"}/>
// //       <VerticalCardProduct category={"televisions"} heading={"Televisions"}/>
// //       <VerticalCardProduct category={"camera"} heading={"Camera & Photography"}/>
// //       <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"}/>
// //       <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers"}/>
// //       <VerticalCardProduct category={"refrigerator"} heading={"Refrigerator"}/>
// //       <VerticalCardProduct category={"trimmers"} heading={"Trimmers"}/>
// //     </div>
// //   )
// // }

// // export default Home
// import React, { useEffect, useState } from 'react';
// import CategoryList from '../components/CategoryList';
// import BannerProduct from '../components/BannerProduct';
// import HorizontalCardProduct from '../components/HorizontalCardProduct';
// import VerticalCardProduct from '../components/VerticalCardProduct';

// const Home = () => {
//   const [categoryProduct, setCategoryProduct] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchCategoryProduct = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("https://localhost:7223/api/Category/getAllCategory");
//       const dataResponse = await response.json();
//       setCategoryProduct(dataResponse);
//     } catch (error) {
//       console.error('Error fetching data:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategoryProduct();
//   }, []);

//   return (
//     <div>
//       <CategoryList categories={categoryProduct} loading={loading} />
//       <BannerProduct />

//       <HorizontalCardProduct category={"airpodes"} heading={"Top's Airpodes"} />
//       <HorizontalCardProduct category={"watches"} heading={"Popular's Watches"} />

//       <VerticalCardProduct category={"mobiles"} heading={"Mobiles"} />
//       <VerticalCardProduct category={"Mouse"} heading={"Mouse"} />
//       <VerticalCardProduct category={"televisions"} heading={"Televisions"} />
//       <VerticalCardProduct category={"camera"} heading={"Camera & Photography"} />
//       <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"} />
//       <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers"} />
//       <VerticalCardProduct category={"refrigerator"} heading={"Refrigerator"} />
//       <VerticalCardProduct category={"trimmers"} heading={"Trimmers"} />
//     </div>
//   );
// }

// export default Home;
import React, { useEffect, useState } from 'react';
import CategoryList from '../components/CategoryList';
import BannerProduct from '../components/BannerProduct';
import HorizontalCardProduct from '../components/HorizontalCardProduct';
import VerticalCardProduct from '../components/VerticalCardProduct';

const Home = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategoryProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://localhost:7223/api/Category/getAllCategory");
      const dataResponse = await response.json();
      setCategoryProduct(dataResponse);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  // Filter categories for HorizontalCardProduct components dynamically
  const horizontalCardCategories = categoryProduct.filter(category =>
    ['airpodes', 'watches'].includes(category.categoryName.toLowerCase())
  );

  // Filter remaining categories for VerticalCardProduct components
  const remainingCategories = categoryProduct.filter(category =>
    !horizontalCardCategories.some(hc => hc.id === category.id)
  );

  return (
    <div>
      <CategoryList categories={categoryProduct} loading={loading} />
      <BannerProduct />

      {horizontalCardCategories.map(category => (
        <HorizontalCardProduct key={category.id} category={category.id} heading={"Top Products"} />
      ))}

      {remainingCategories.map(category => (
        <VerticalCardProduct key={category.id} category={category.id} heading={category.categoryName} />
      ))}
    </div>
  );
}

export default Home;


