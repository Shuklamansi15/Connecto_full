import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../contex/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedInfluencers = ({ category, infId }) => {

    const { influencers } = useContext(AppContext)
    const navigate = useNavigate()

    const [relInf, setRelInf] = useState([])

    useEffect(() => {
        // SAFETY CHECKS — avoids "Cannot read property 'length' of undefined"
        if (!influencers || influencers.length === 0) {
            setRelInf([])
            return
        }

        if (!category) {
            setRelInf([])
            return
        }

        // Filter safely
        const related = influencers.filter(
            (inf) => inf.category === category && inf._id !== infId
        )

        setRelInf(related)
    }, [influencers, category, infId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Other Influencers in {category || 'This Category'}</h1>
            <p className='sm:w-1/3 text-center text-sm'>
                Discover other popular content creators specializing in the same field.
            </p>

            <div className='w-full grid [grid-template-columns:repeat(auto-fill,minmax(175px,1fr))] grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {relInf.length > 0 ? (
                    relInf.slice(0, 5).map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                navigate(`/consultation/${item._id}`)
                                scrollTo(0, 0)
                            }}
                            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
                        >
                            <img className='bg-blue-50' src={item.image} alt={item.name} />

                            <div className='p-4'>
                                <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                    <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                                    <p>Available</p>
                                </div>

                                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                                <p className='text-gray-600 text-sm'>{item.category}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-gray-500 text-sm italic p-4'>
                        No related influencers found.
                    </p>
                )}
            </div>

            <button
                onClick={() => {
                    navigate('/influencers')
                    scrollTo(0, 0)
                }}
                className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'
            >
                View All Influencers
            </button>
        </div>
    )
}

export default RelatedInfluencers
