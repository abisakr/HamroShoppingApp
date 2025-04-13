import React, { useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import { toast } from 'react-toastify';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [data, setData] = useState({
        fullName: "",
        phone: "",
        password: "",
        confirmPassword: "",
        profilePic: "",
        address: "",
        city: "",
        country: "",
    });

    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUploadPic = async (e) => {
        const file = e.target.files[0];
        const imagePic = await imageTobase64(file);
        setData(prev => ({
            ...prev,
            profilePic: imagePic
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.password !== data.confirmPassword) {
            toast.error("Please check password and confirm password");
            return;
        }

        try {
            const res = await fetch("https://localhost:7223/api/UserAccount/register", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: data.fullName,
                    password: data.password,
                    phoneNo: data.phone,
                    address: data.address,
                    city: data.city,
                    country: data.country,

                })
            });

            const result = await res.json();

            if (res.ok) {
                toast.success(result.message || "Registration Successful.");
                navigate("/login");
            } else {
                toast.error(result.message || "User Creation Failed");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error(error);
        }
    };

    return (
        <section id='signup'>
            <div className='mx-auto container p-4'>
                <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                        <div>
                            <img src={data.profilePic || loginIcons} alt='login icon' />
                        </div>
                        <form>
                            <label>
                                <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                                    Upload Photo
                                </div>
                                <input type='file' className='hidden' onChange={handleUploadPic} />
                            </label>
                        </form>
                    </div>

                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                        <InputField label="Full Name" name="fullName" value={data.fullName} onChange={handleOnChange} />
                        <InputField label="Phone" name="phone" value={data.phone} onChange={handleOnChange} />
                        <InputField label="Country" name="country" value={data.country} onChange={handleOnChange} />
                        <InputField label="City" name="city" value={data.city} onChange={handleOnChange} />
                        <InputField label="Address" name="address" value={data.address} onChange={handleOnChange} />

                        <PasswordField
                            label="Password"
                            name="password"
                            value={data.password}
                            show={showPassword}
                            toggle={() => setShowPassword(prev => !prev)}
                            onChange={handleOnChange}
                        />

                        <PasswordField
                            label="Confirm Password"
                            name="confirmPassword"
                            value={data.confirmPassword}
                            show={showConfirmPassword}
                            toggle={() => setShowConfirmPassword(prev => !prev)}
                            onChange={handleOnChange}
                        />

                        <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>
                            Sign Up
                        </button>
                    </form>

                    <p className='my-5'>Already have an account? <Link to={"/login"} className='text-red-600 hover:text-red-700 hover:underline'>Login</Link></p>
                </div>
            </div>
        </section>
    );
};

const InputField = ({ label, name, value, onChange }) => (
    <div className='grid'>
        <label>{label}:</label>
        <div className='bg-slate-100 p-2'>
            <input
                type='text'
                name={name}
                value={value}
                onChange={onChange}
                placeholder={`Enter your ${label.toLowerCase()}`}
                required
                className='w-full h-full outline-none bg-transparent'
            />
        </div>
    </div>
);

const PasswordField = ({ label, name, value, show, toggle, onChange }) => (
    <div>
        <label>{label}:</label>
        <div className='bg-slate-100 p-2 flex'>
            <input
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={`Enter your ${label.toLowerCase()}`}
                required
                className='w-full h-full outline-none bg-transparent'
            />
            <div className='cursor-pointer text-xl' onClick={toggle}>
                {show ? <FaEyeSlash /> : <FaEye />}
            </div>
        </div>
    </div>
);

export default SignUp;
