import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VerticalCard from '../components/VerticalCard';

const SearchProduct = () => {
    const query = useLocation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProduct = async () => {
        setLoading(true);
        
        try {
            // Remove the extra '?' and 'q=' from query.search
            const searchTerm = query.search.replace('?q=', '');

            const response = await fetch(`https://localhost:7223/api/Product/getAllSearchedProducts?name=${searchTerm}`);
            const dataResponse = await response.json();

            setLoading(false);

            if (response.ok) {
                console.log("API response:", dataResponse); // Log the API response for debugging

                // Ensure dataResponse.data is initialized as an array
                const responseData = Array.isArray(dataResponse) ? dataResponse : (dataResponse.data || []);
                setData(responseData);
                
            } else {
                console.error("API request failed:", dataResponse);
            }
        } catch (error) {
            setLoading(false);
            console.error("Error fetching product details:", error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [query]);

    // Ensure data has a fallback value in case it's still undefined
    const searchResultsCount = data.length || 0;

    console.log("data length:", data.length); // Log data length to debug

    return (
        <div className='container mx-auto p-4'>
            {loading && <p className='text-lg text-center'>Loading ...</p>}

            <p className='text-lg font-semibold my-3'>Search Results : {searchResultsCount}</p>

            {searchResultsCount === 0 && !loading && (
                <p className='bg-white text-lg text-center p-4'>No Data Found....</p>
            )}

            {searchResultsCount !== 0 && !loading && (
                <VerticalCard loading={loading} data={data} />
            )}
        </div>
    );
};

export default SearchProduct;
