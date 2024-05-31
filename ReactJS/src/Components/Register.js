import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
 const Register = () => {
const [password,setPassword]=useState("");
const [fullName, setFullName] = useState("");
//const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [city, setCity] = useState("");
const [country, setCountry] = useState("");
const navigate = useNavigate();

    const  HandleData=async (newData)=>{
      console.log(phone);
        newData.preventDefault();    
const response= await fetch("https://localhost:7223/api/UserAccount/register",{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({fullName,password,PhoneNo:phone,address,city,country})

})
if (response.ok) {
    alert('Registration successful');
   navigate("/Login")
} else {
console.log(response.text);

    alert('Registration failed');
}

    }
  return (
    <>

    <div>Register</div>
    <form onSubmit={HandleData}>
    <input type='text'placeholder='FullName' value={fullName} onChange={(e) => setFullName(e.target.value)} ></input><br/>
    {/* <input type='email'placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} ></input><br/> */}
    <input type='tel'placeholder='PhoneNumber' value={phone} onChange={(e) => setPhone(e.target.value)} ></input><br/>
    <input type='text'placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} ></input><br/>
    <input type='text'placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} ></input><br/>
    <input type='text'placeholder='Country' value={country} onChange={(e) => setCountry(e.target.value)} ></input><br/>
    <input type='password'placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} ></input><br/>
    <button type='submit'>Register</button>
    </form>
    </>
  )
}
export default Register;
