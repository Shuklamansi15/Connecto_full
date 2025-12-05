// src/components/RelatedInfluencers.jsx
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../contex/AppContext' // keep your existing path

const RelatedInfluencers = ({ category, speciality, infId }) => {
  const navigate = useNavigate()

  // Accept either context name and default to empty array
  const ctx = useContext(AppContext) || {}
  const influencers = ctx.influencers || ctx.Influencers || []

  // Accept either prop name (category or speciality)
  const cat = (category || speciality || '').toString()

  const [relInf, setRelInf] = useState([])

  useEffect(() => {
    if (!cat) {
      setRelInf([])
      return
    }
    if (!Array.isArray(influencers) || influencers.length === 0) {
      setRelInf([])
      return
    }

    const filtered = influencers.filter(inf => {
      // defensive checks
      const infCat = (inf?.category || inf?.speciality || '').toString()
      if (!infCat) return false
      // case-insensitive compare and skip current influencer
      return infCat.toLowerCase() === cat.toLowerCase() && String(inf._id) !== String(infId)
    })

    // Limit to a reasonable number, e.g., 4 to 8, to prevent overwhelming the user
    setRelInf(filtered.slice(0, 8)) 
  }, [influencers, cat, infId])

  if (!cat || relInf.length === 0) return null // nothing to show or no related influencers

  return (
    <div className="my-8 pt-4 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        <span className="border-b-2 border-[#1999d5] pb-1">Related Influencers</span>
      </h3>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {relInf.map(inf => (
          <div
            key={inf._id}
            onClick={() => {
              navigate(`/consultation/${inf._id}`)
              window.scrollTo(0, 0)
            }}
            // **UI/UX Fixes:** Better card styling with shadow, rounded corners, and hover effects
            className="cursor-pointer bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden 
                       hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
          >
            {/* Image Container with fixed aspect ratio */}
            <div className="w-full aspect-square overflow-hidden bg-gray-100"> 
              <img
                src={inf.image}
                alt={inf.name}
                // **UI/UX Fixes:** Ensure cover behavior for different image sizes
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
              />
            </div>
            
            <div className="p-3 text-center">
              {/* **UI/UX Fixes:** Clearer, bolder name */}
              <p className="text-base font-semibold text-gray-900 truncate mb-1">
                {inf.name}
              </p>
              {/* **UI/UX Fixes:** Distinct styling for category/speciality */}
              <span className="inline-block text-xs font-medium text-[#1999d5] bg-indigo-100 px-2 py-0.5 rounded-full">
                {inf.category || inf.speciality || 'Unspecified'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedInfluencers