import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import DisplayImage from './DisplayImage';
import uploadImage from '../helpers/uploadImage';

const AdminEditCategory = ({
    onClose,
    productData,
    fetchdata
}) => {
    const [data, setData] = useState({
        categoryName: productData?.categoryName || '',
        photo: productData?.photoPath || '',
    });

    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        const uploadImageCloudinary = await uploadImage(file);

        setData((prev) => ({
            ...prev,
            photo: uploadImageCloudinary.url
        }));
    };

    const handleDeleteProductImage = () => {
        setData((prev) => ({
            ...prev,
            photo: ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append('categoryName', data.categoryName);
            
            // Only append photoPath if it is not empty (i.e., a new image was uploaded)
            if (data.photo) {
                formData.append('photo', data.photo);
            }
    
            const response = await fetch(`https://localhost:7223/api/Category/editCategory/${productData.id}`, {
                method: 'PUT',
                body: formData
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                toast.success(responseData?.message || "Category updated successfully.");
                onClose();
                fetchdata();
            } else {
                if (response.status === 400) {
                    // Handle validation errors
                    const validationErrors = await response.json();
                    Object.keys(validationErrors.errors).forEach((key) => {
                        toast.error(validationErrors.errors[key][0]);
                    });
                } else {
                    // Handle other errors
                    toast.error(responseData?.message || "Failed to update category.");
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to update category.");
        }
    };
    
    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Edit Category</h2>
                    <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>

                <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
                    <label htmlFor='categoryName'>Category Name :</label>
                    <input
                        type='text'
                        id='categoryName'
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
                        {data.photo ? (
                            <div className='relative group'>
                                <img
                                    src={data.photo}
                                    alt="Category"
                                    width={80}
                                    height={80}
                                    className='bg-slate-100 border cursor-pointer'
                                    onClick={() => {
                                        setOpenFullScreenImage(true);
                                        setFullScreenImage(data.photo);
                                    }}
                                />
                                <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={handleDeleteProductImage}>
                                    <MdDelete />
                                </div>
                            </div>
                        ) : (
                            <p className='text-red-600 text-xs'>*Please upload Category image</p>
                        )}
                    </div>

                    <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Update Category</button>
                </form>
            </div>

            {openFullScreenImage && (
                <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
            )}
        </div>
    );
};

export default AdminEditCategory;
