
import React from 'react';
import { Link } from 'react-router-dom';

const CategoryList = ({ categories, loading }) => {
  const categoryLoading = new Array(13).fill(null);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex items-center gap-4 justify-between overflow-scroll scrollbar-none'>
        {
          loading ? (
            categoryLoading.map((_, index) => (
              <div className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse' key={"categoryLoading" + index}>
              </div>
            ))
          ) : (
            categories.map((category) => (
              <Link to={`/product-category?category=${category.id}`} className='cursor-pointer' key={category.id}>
                <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                  <img src={`data:image/jpeg;base64,${category.photoPath}`} alt={category.categoryName} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all' />
                </div>
                <p className='text-center text-sm md:text-base capitalize'>{category.categoryName}</p>
              </Link>
            ))
          )
        }
      </div>
    </div>
  );
}

export default CategoryList;
