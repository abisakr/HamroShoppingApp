import React, { useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)
  const [data,setData] = useState({
      fullName : "",
      phone : "",
      password : "",
      confirmPassword : "",
      profilePic : "",
      address : "",
      city : "",
      country : "",
  })
  const navigate = useNavigate()

  const handleOnChange = (e) =>{
      const { name , value } = e.target

      setData((preve)=>{
          return{
              ...preve,
              [name] : value
          }
      })
  }

  const handleUploadPic = async(e) =>{
    const file = e.target.files[0]
    
    const imagePic = await imageTobase64(file)
    
    setData((preve)=>{
      return{
        ...preve,
        profilePic : imagePic
      }
    })

  }


  const handleSubmit = async(e) =>{
      e.preventDefault()

      if(data.password === data.confirmPassword){

        const dataResponse= await fetch("https://localhost:7223/api/UserAccount/register",{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({fullName: data.fullName,password:data.password,PhoneNo:data.phone,address:data.address,city:data.city,country:data.country})
        })

          const dataApi = await dataResponse.text()

          if(dataResponse.ok){
            toast.success("Registration Successful.")
            navigate("/login")
          }

          if(dataApi.error){
            toast.error(dataApi.message)
          }
    
      }else{
        toast.error("Please check password and confirm password")
      }

  }

  return (
    <section id='signup'>
        <div className='mx-auto container p-4'>

            <div className='bg-white p-5 w-full max-w-sm mx-auto'>

                    <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                        <div>
                            <img src={data.profilePic || loginIcons} alt='login icons'/>
                        </div>
                        <form>
                          <label>
                            <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                              Upload  Photo
                            </div>
                            <input type='file' className='hidden' onChange={handleUploadPic}/>
                          </label>
                        </form>
                    </div>

                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                      <div className='grid'>
                              <label>Full Name : </label>
                              <div className='bg-slate-100 p-2'>
                                  <input 
                                      type='text' 
                                      placeholder='Enter your full name' 
                                      name='fullName'
                                      value={data.fullName}
                                      onChange={handleOnChange}
                                      required
                                      className='w-full h-full outline-none bg-transparent'/>
                              </div>
                          </div>
                        <div className='grid'>
                            <label>Phone : </label>
                            <div className='bg-slate-100 p-2'>
                                <input 
                                    type='phone' 
                                    placeholder='Enter your phone no' 
                                    name='phone'
                                    value={data.phone}
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent'/>
                            </div>
                        </div>
                        <div className='grid'>
                            <label>Country : </label>
                            <div className='bg-slate-100 p-2'>
                                <input 
                                    type='text' 
                                    placeholder='Enter your country' 
                                    name='country'
                                    value={data.country}
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent'/>
                            </div>
                        </div>
                        <div className='grid'>
                            <label>City : </label>
                            <div className='bg-slate-100 p-2'>
                                <input 
                                    type='text' 
                                    placeholder='Enter your city' 
                                    name='city'
                                    value={data.city}
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent'/>
                            </div>
                        </div>

                        <div className='grid'>
                            <label>Address : </label>
                            <div className='bg-slate-100 p-2'>
                                <input 
                                    type='text' 
                                    placeholder='Enter your address' 
                                    name='address'
                                    value={data.address}
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent'/>
                            </div>
                        </div>
                        <div>
                            <label>Password : </label>
                            <div className='bg-slate-100 p-2 flex'>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder='Enter your password'
                                    value={data.password}
                                    name='password' 
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent'/>
                                <div className='cursor-pointer text-xl' onClick={()=>setShowPassword((preve)=>!preve)}>
                                    <span>
                                        {
                                            showPassword ? (
                                                <FaEyeSlash/>
                                            )
                                            :
                                            (
                                                <FaEye/>
                                            )
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label>Confirm Password : </label>
                            <div className='bg-slate-100 p-2 flex'>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder='Enter your confirm password'
                                    value={data.confirmPassword}
                                    name='confirmPassword' 
                                    onChange={handleOnChange}
                                    required
                                    className='w-full h-full outline-none bg-transparent'/>

                                <div className='cursor-pointer text-xl' onClick={()=>setShowConfirmPassword((preve)=>!preve)}>
                                    <span>
                                        {
                                            showConfirmPassword ? (
                                                <FaEyeSlash/>
                                            )
                                            :
                                            (
                                                <FaEye/>
                                            )
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Sign Up</button>

                    </form>

                    <p className='my-5'>Already have account ? <Link to={"/login"} className=' text-red-600 hover:text-red-700 hover:underline'>Login</Link></p>
            </div>


        </div>
    </section>
  )
}

export default SignUp