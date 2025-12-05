import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddInfluencer = () => {

    const [infImg, setInfImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [category, setCategory] = useState('Gaming')
    const [followers, setFollowers] = useState('')
    const [about, setAbout] = useState('')

    const [instagram, setInstagram] = useState('')
    const [youtube, setYoutube] = useState('')
    const [facebook, setFacebook] = useState('')
    const [twitter, setTwitter] = useState('')
    const [tiktok, setTiktok] = useState('')

    // NEW: rates according to schema
    const [rateChat, setRateChat] = useState('')
    const [rateCall, setRateCall] = useState('')
    const [rateVideo, setRateVideo] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!infImg) return toast.error('Image Not Selected')

            const formData = new FormData();

            formData.append('image', infImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('category', category)
            formData.append('followers', followers)
            formData.append('about', about)

            // social links
            formData.append('socialLinks', JSON.stringify({
                instagram,
                youtube,
                facebook,
                twitter,
                tiktok
            }))

            // FIXED FIELD NAME: rates (matches schema)
            formData.append('rates', JSON.stringify({
                chat: rateChat || null,
                call: rateCall || null,
                video: rateVideo || null
            }))

            formData.append('date', Date.now())

            const { data } = await axios.post(
                backendUrl + '/api/admin/add-influencer',
                formData,
                { headers: { aToken } }
            )

            if (data.success) {
                toast.success(data.message)

                // Reset all fields
                setInfImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setFollowers('')
                setAbout('')
                setInstagram('')
                setYoutube('')
                setFacebook('')
                setTwitter('')
                setTiktok('')
                setRateChat('')
                setRateCall('')
                setRateVideo('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Add Influencer</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="inf-img">
                        <img
                            className='w-16 bg-gray-100 rounded-full cursor-pointer'
                            src={infImg ? URL.createObjectURL(infImg) : assets.upload_area}
                            alt=""
                        />
                    </label>
                    <input onChange={(e) => setInfImg(e.target.files[0])} type="file" id="inf-img" hidden />
                    <p>Upload influencer <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    {/* LEFT */}
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Name</p>
                            <input onChange={e => setName(e.target.value)} value={name}
                                className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email}
                                className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password}
                                className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Category</p>
                            <select onChange={e => setCategory(e.target.value)} value={category}
                                className='border rounded px-2 py-2'>
                                <option value="Gaming">Gaming</option>
                                <option value="Tech">Tech</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Fitness">Fitness</option>
                                <option value="Finance">Finance</option>
                                <option value="Art">Art</option>
                                <option value="Cooking">Cooking</option>
                                <option value="Travel">Travel</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Followers</p>
                            <input onChange={e => setFollowers(e.target.value)} value={followers}
                                className='border rounded px-3 py-2' type="number" placeholder='Total followers' required />
                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Instagram</p>
                            <input onChange={e => setInstagram(e.target.value)} value={instagram}
                                className='border rounded px-3 py-2' type="text" placeholder='Instagram link' />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>YouTube</p>
                            <input onChange={e => setYoutube(e.target.value)} value={youtube}
                                className='border rounded px-3 py-2' type="text" placeholder='YouTube link' />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Facebook</p>
                            <input onChange={e => setFacebook(e.target.value)} value={facebook}
                                className='border rounded px-3 py-2' type="text" placeholder='Facebook link' />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Twitter</p>
                            <input onChange={e => setTwitter(e.target.value)} value={twitter}
                                className='border rounded px-3 py-2' type="text" placeholder='Twitter link' />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>TikTok</p>
                            <input onChange={e => setTiktok(e.target.value)} value={tiktok}
                                className='border rounded px-3 py-2' type="text" placeholder='TikTok link' />
                        </div>

                    </div>

                </div>

                {/* RATES */}
                <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-5'>
                    <div className='flex flex-col gap-1'>
                        <p>Chat Rate</p>
                        <input onChange={e => setRateChat(e.target.value)} value={rateChat}
                            className='border rounded px-3 py-2' type="number" placeholder='Chat rate' />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <p>Call Rate</p>
                        <input onChange={e => setRateCall(e.target.value)} value={rateCall}
                            className='border rounded px-3 py-2' type="number" placeholder='Call rate' />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <p>Video Rate</p>
                        <input onChange={e => setRateVideo(e.target.value)} value={rateVideo}
                            className='border rounded px-3 py-2' type="number" placeholder='Video rate' />
                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2'>About Influencer</p>
                    <textarea
                        onChange={e => setAbout(e.target.value)}
                        value={about}
                        className='w-full px-4 pt-2 border rounded'
                        rows={5}
                        placeholder='Write about influencer'></textarea>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>
                    Add Influencer
                </button>

            </div>

        </form>
    )
}

export default AddInfluencer
