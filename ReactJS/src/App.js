import React from "react";
import Home from "./Components/Home";
import Contact from "./Components/Contact";
import Nav from "./Components/Nav";
import {Route, Routes} from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Successful from "./Components/Successful";
import RequireAuth from "./Components/RequireAuth";
const App=()=>{
return(
<>
<Nav/>
<Routes>
<Route exact path="/" element={<Home/>}/>
<Route exact path="/register" element={<Register/>}/>
<Route  path="/contact" element={<Contact/>}/>
<Route  path="/login" element={<Login/>}/>
<Route  path="/successful" element={<RequireAuth><Successful /></RequireAuth> }/>
</Routes>
</>
   );
}
export default App;
