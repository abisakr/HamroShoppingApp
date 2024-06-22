import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

const AdminEditProduct = ({
    onClose,
    productData,
    fetchdata
}) => {
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [data, setData] = useState({
        productName: productData?.productName || '',
        categoryId: productData?.categoryId || '', // Use categoryId instead of category
        photoPath: productData?.photoPath || '',
        description: productData?.description || '',
        price: productData?.price || '',
        discount: productData?.discount || '',
        deliveryStatus: productData?.deliveryStatus || '',
        stockQuantity: productData?.stockQuantity || '',
        stockSold: productData?.stockSold || '',
    });

    const [loading, setLoading] = useState(false);
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
            photoPath: uploadImageCloudinary.url
        }));
    };

    const handleDeleteProductImage = () => {
        setData((prev) => ({
            ...prev,
            photoPath: ""
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`https://localhost:7223/api/Product/editProduct/${productData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (response.ok) {
            toast.success(responseData?.message);
            onClose();
            fetchdata();
        } else {
            toast.error(responseData?.message);
        }
    };

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

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>

                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Edit Product</h2>
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
                    {loading ? (
                        <p>Loading categories...</p>
                    ) : (
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
                    )}

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
                        {data.photoPath ? (
                            <div className='relative group'>
                                <img
                                    src={data.photoPath}
                                    alt="Product"
                                    width={80}
                                    height={80}
                                    className='bg-slate-100 border cursor-pointer'
                                    onClick={() => {
                                        setOpenFullScreenImage(true);
                                        setFullScreenImage(data.photoPath);
                                    }}
                                />
                                <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={handleDeleteProductImage}>
                                    <MdDelete />
                                </div>
                            </div>
                        ) : (
                            <p className='text-red-600 text-xs'>*Please upload product image</p>
                        )}
                    </div>

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

                    <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Update Product</button>
                </form>

            </div>

            {openFullScreenImage && (
                <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />
            )}

        </div>
    );
};

export default AdminEditProduct;
