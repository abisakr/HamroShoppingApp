import React from "react";
import Home from "./Components/Home";
import Nav from "./Components/Nav";
import {Route, Routes} from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import MyCart from "./Components/MyCart";
import RequireAuth from "./Components/RequireAuth";
import OrderedProductDetail from "./Components/OrderedProductDetail";
const App=()=>{
return(
<>
<Nav/>
<Routes>
<Route exact path="/" element={<Home/>}/>
<Route exact path="/register" element={<Register/>}/>
<Route  path="/login" element={<Login/>}/>
<Route  path="/product/:id" element={<OrderedProductDetail/>}/>
<Route  path="/cart" element={<RequireAuth><MyCart /></RequireAuth> }/>
</Routes>
</>
   );
}
export default App;
