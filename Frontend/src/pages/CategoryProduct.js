import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'

const CategoryProduct = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [sortBy, setSortBy] = useState("")
    const [selectCategory, setSelectCategory] = useState({})
    const [filterCategoryList, setFilterCategoryList] = useState([])

    const navigate = useNavigate()
    const location = useLocation()
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryListinArray = urlSearch.getAll("category")
    const categoryId = urlSearch.get("category")

    useEffect(() => {
        const initialCategory = {}
        urlCategoryListinArray.forEach(el => {
            initialCategory[el] = true
        })
        setSelectCategory(initialCategory)
    }, [])

    const fetchData = async (categoryId = null) => {
        setLoading(true)
        try {
            let url = ""

            if (sortBy && filterCategoryList.length) {
                const categories = filterCategoryList.join(',')
                url = `https://localhost:7223/api/Product/getShortedFilteredProduct?categoryName=${categories}&order=${sortBy}`
            } else if (categoryId) {
                url = `https://localhost:7223/api/Product/getProductByCategoryId/${categoryId}`
            }

            if (!url) return

            const response = await fetch(url)
            if (!response.ok) throw new Error("Failed to fetch data")

            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (categoryId) {
            fetchData(categoryId)
        }
    }, [categoryId, sortBy])

    useEffect(() => {
        const arrayOfCategory = Object.keys(selectCategory).filter(categoryKeyName => selectCategory[categoryKeyName])
        setFilterCategoryList(arrayOfCategory)

        const urlFormat = arrayOfCategory.map(el => `category=${el}`)
        navigate("/product-category?" + urlFormat.join("&&"))
    }, [selectCategory])

    const handleSelectCategory = (e) => {
        const { value, checked } = e.target
        setSelectCategory(prev => ({
            ...prev,
            [value]: checked
        }))
    }

    const handleOnChangeSortBy = async (e) => {
        const { value } = e.target
        setSortBy(value)
    }

    return (
        <div className='container mx-auto p-4'>
            <div className='hidden lg:grid grid-cols-[200px,1fr]'>
                <div className='bg-white p-2 min-h-[calc(100vh-120px)] overflow-y-scroll'>
                    <div>
                        <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>
                        <form className='text-sm flex flex-col gap-2 py-2'>
                            <div className='flex items-center gap-3'>
                                <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value="asc" />
                                <label>Price - Low to High</label>
                            </div>
                            <div className='flex items-center gap-3'>
                                <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value="dsc" />
                                <label>Price - High to Low</label>
                            </div>
                        </form>
                    </div>

                    <div>
                        <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>
                        <form className='text-sm flex flex-col gap-2 py-2'>
                            {
                                productCategory.map((categoryName, index) => (
                                    <div className='flex items-center gap-3' key={index}>
                                        <input
                                            type='checkbox'
                                            name='category'
                                            checked={selectCategory[categoryName?.value] || false}
                                            value={categoryName?.value}
                                            id={categoryName?.value}
                                            onChange={handleSelectCategory}
                                        />
                                        <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                                    </div>
                                ))
                            }
                        </form>
                    </div>
                </div>

                <div className='px-4'>
                    <p className='font-medium text-slate-800 text-lg my-2'>Search Results : {data.length}</p>
                    <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
                        {
                            data.length !== 0 && !loading && (
                                <VerticalCard data={data} loading={loading} />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryProduct
