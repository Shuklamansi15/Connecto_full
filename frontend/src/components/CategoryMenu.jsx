import React from 'react'
// CHANGE 1: Import 'categoryData' instead of 'specialityData'
import { categoryData } from '../assets/assets' 
import {Link} from 'react-router-dom'

// CHANGE 2: Rename component to reflect the new content
const CategoryMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800' id='categories'>
       
        <h1 className='text-3xl font-medium' >Find by Category</h1>
  
        <p className='sm:w-1/3 text-center text-sm'>Browse through our diverse categories and find the perfect content creator for your needs.</p>
        <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
           
            {categoryData.map((item,index)=>(
              
                <Link onClick={()=>scrollTo(0,0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/influencers/${item.category}`}>
                    <img className='w-16 sm:w-24 mb-2' src={item.image} alt=''/>
                  
                    <p>{item.category}</p>
                </Link>
            ))}
        </div>

    </div>
  )
}

// CHANGE 9: Export the new component name
export default CategoryMenu