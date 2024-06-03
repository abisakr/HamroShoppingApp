import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

 const Login = () => {
const [phone,setPhone]=useState('');
const [password,setpassword]=useState('');
const navigate = useNavigate();

    const  HandleData=async (newData)=>{
        newData.preventDefault();    
const response= await fetch("https://localhost:7223/api/UserAccount/login",{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({PhoneNoAsUser: phone,password})

})
const token= await response.text();
if (response.ok) {
    localStorage.setItem("token",token); // Assume the token is returned under the key 'token'
    navigate('/cart');
    alert('Login successful');

} else {
    alert(token);
}

    }
  return (
    <>

    <div>Login</div>
    <form onSubmit={HandleData}>
<input type='phone'placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} ></input><br/>
<input type='password'placeholder='Password' value={password} onChange={(e) => setpassword(e.target.value)} ></input><br/>
<button type='submit'>Login</button>
    </form>
    </>
  )
}
export default Login;
