
import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

const UploadCategory = ({
    onClose,
    fetchData
}) => {
       const [data, setData] = useState({
        categoryName: "",
        photo: null, // Only store one photo as a string
    });

    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");

    // Function to handle changes in input fields
    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Function to handle file upload
    const handleUploadProduct = (e) => {
        const file = e.target.files[0];
        
        setData((prev) => ({
            ...prev,
            photo: file // Store the selected file object
        }));
    };

    // Function to clear the uploaded product image
    const handleDeleteProductImage = () => {
        setData((prev) => ({
            ...prev,
            photo: null // Clear the photo file
        }));
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if all required fields are populated
        if (!data.categoryName || !data.photo) {
            toast.error("Please fill in all required fields.");
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append("categoryName", data.categoryName);
            formData.append("photo", data.photo);
          
    
            const response = await fetch("https://localhost:7223/api/Category/createCategory", {
                method: 'POST',
                body: formData
            });
    
            const responseData = await response.text(); // Since backend returns a string
            console.log("Response Data:", responseData); // Log the response data
    
            if (response.ok) {
                // Check the exact response text for success
                if (responseData === "Successfully Saved") {
                    toast.success("Product Created.");
                    onClose(); // Close the modal
                    fetchData(); // Refresh the product data
                } else {
                    toast.error("Failed to create product.");
                }
            } else {
                // Handle HTTP error responses
                toast.error("Failed to create product.");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to create product.");
        }
    };
    
    // Function to fetch categories
    

    return (
        <div className='fixed w-full  h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>

                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Upload Product</h2>
                    <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>

                <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    <label htmlFor='categoryName'>Category Name :</label>
                    <input
                        type='text'
                        id='productName'
                        placeholder='Enter category name'
                        name='categoryName'
                        value={data.categoryName}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                   

                    <label htmlFor='productImage' className='mt-3'>Category Image :</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl'><FaCloudUploadAlt /></span>
                                <p className='text-sm'>Upload Category Image</p>
                                <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} />
                            </div>
                        </div>
                    </label>
                    <div>
                        {data.photo && (
                            <div className='flex items-center gap-2'>
                                <div className='relative group'>
                                    <img
                                        src={URL.createObjectURL(data.photo)}
                                        alt="category"
                                        width={80}
                                        height={80}
                                        className='bg-slate-100 border cursor-pointer'
                                        onClick={() => {
                                            setOpenFullScreenImage(true);
                                            setFullScreenImage(URL.createObjectURL(data.photo));
                                        }}
                                    />
                                    <div
                                        className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer'
                                        onClick={handleDeleteProductImage}
                                    >
                                        <MdDelete />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    

                    <button className='px-3 py-2 bg-red-600 text-white mt-5 hover:bg-red-700'>Upload Category</button>
                </form>

            </div>

            {/*** Display image full screen ***/}
            {openFullScreenImage && (
                <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
            )}

        </div>
    );
};

export default UploadCategory;
