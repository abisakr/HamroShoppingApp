import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

const UploadProduct = ({
    onClose,
    fetchData
}) => {
    const [data, setData] = useState({
        productName: "",
        categoryId: "", // State to hold selected categoryId
        photo: null, // Store the image file object
        description: "",
        price: "",
        discount: "",
        stockQuantity: "",
        deliveryStatus: "",
    });

    const [categoryProduct, setCategoryProduct] = useState([]);
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
        if (!data.productName || !data.categoryId || !data.photo || !data.description || !data.price || !data.discount || !data.stockQuantity || !data.deliveryStatus) {
            toast.error("Please fill in all required fields.");
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append("productName", data.productName);
            formData.append("categoryId", parseInt(data.categoryId));
            formData.append("photo", data.photo);
            formData.append("description", data.description);
            formData.append("price", parseFloat(data.price));
            formData.append("discount", parseFloat(data.discount));
            formData.append("stockQuantity", parseInt(data.stockQuantity));
            formData.append("deliveryStatus", data.deliveryStatus);
    
            const response = await fetch("https://localhost:7223/api/Product/createProduct", {
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
    const fetchCategoryProduct = async () => {
        try {
            const response = await fetch("https://localhost:7223/api/Category/getAllCategory");
            const dataResponse = await response.json();
            setCategoryProduct(dataResponse);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        fetchCategoryProduct();
    }, []);

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
                    <label htmlFor='productName'>Product Name :</label>
                    <input
                        type='text'
                        id='productName'
                        placeholder='Enter product name'
                        name='productName'
                        value={data.productName}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='category' className='mt-3'>Category :</label>
                    <select
                        required
                        value={data.categoryId} // Use categoryId here
                        name='categoryId' // Ensure this matches the state property name
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    >
                        <option value={""}>Select Category</option>
                        {categoryProduct.map((el) => (
                            <option value={el.id} key={el.id}>{el.categoryName}</option> // Use el.id for value
                        ))}
                    </select>

                    <label htmlFor='price' className='mt-3'>Price :</label>
                    <input
                        type='number'
                        id='price'
                        placeholder='Enter price'
                        value={data.price}
                        name='price'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='discount' className='mt-3'>Discount :</label>
                    <input
                        type='number'
                        id='discount'
                        placeholder='Enter discount'
                        value={data.discount}
                        name='discount'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='stockQuantity' className='mt-3'>Stock Quantity :</label>
                    <input
                        type='number'
                        id='stockQuantity'
                        placeholder='Enter stock quantity'
                        value={data.stockQuantity}
                        name='stockQuantity'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='deliveryStatus' className='mt-3'>Delivery Status :</label>
                    <input
                        type='text'
                        id='deliveryStatus'
                        placeholder='Enter delivery status'
                        value={data.deliveryStatus}
                        name='deliveryStatus'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                        required
                    />

                    <label htmlFor='productImage' className='mt-3'>Product Image :</label>
                    <label htmlFor='uploadImageInput'>
                        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                            <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                                <span className='text-4xl'><FaCloudUploadAlt /></span>
                                <p className='text-sm'>Upload Product Image</p>
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
                                        alt="Product"
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

                    <label htmlFor='description' className='mt-3'>Description :</label>
                    <textarea
                        className='h-28 bg-slate-100 border resize-none p-1'
                        placeholder='Enter product description'
                        rows={3}
                        onChange={handleOnChange}
                        name='description'
                        value={data.description}
                    >
                    </textarea>

                    <button className='px-3 py-2 bg-red-600 text-white mt-5 hover:bg-red-700'>Upload Product</button>
                </form>

            </div>

            {/*** Display image full screen ***/}
            {openFullScreenImage && (
                <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
            )}

        </div>
    );
};

export default UploadProduct;
