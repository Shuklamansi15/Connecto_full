import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import influencerModel from "../models/influencerModel.js";
import consultationModel from "../models/consultationModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import razorpay from 'razorpay';

// // Gateway Initialize
// const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
// const razorpayInstance = new razorpay({
// 	key_id: process.env.RAZORPAY_KEY_ID,
// 	key_secret: process.env.RAZORPAY_KEY_SECRET,
// })

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }
        
        // checking if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: 'User already exists' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book consultation 
const bookConsultation = async (req, res) => { 
    try {

        const { userId, infId, slotDate, slotTime, mode } = req.body
        
        // --- VALIDATION AND DATA RETRIEVAL ---
        if (!userId || !infId || !slotDate || !slotTime || !mode) {
             return res.json({ success: false, message: 'Missing required consultation details (userId, infId, slotDate, slotTime, mode).' })
        }

        const userData = await userModel.findById(userId).select("-password")
        if (!userData) {
            return res.json({ success: false, message: 'User not found.' })
        }

        const infData = await influencerModel.findById(infId)
        if (!infData) {
            return res.json({ success: false, message: 'Influencer not found.' })
        }

        // Determine the amount based on the selected mode
        const amount = infData.rates?.[mode]
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.json({ success: false, message: `Invalid or missing consultation rate for mode: ${mode}` })
        }
        
        if (!infData.available) {
            return res.json({ success: false, message: 'Influencer Not Available' })
        }
        // --- END VALIDATION ---
        
        let slots_booked = infData.slots_booked || {} // Initialize if null/undefined

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }
        
        // Remove slots_booked and password from infData
        const cleanInfData = { ...infData.toObject() };
        delete cleanInfData.slots_booked;
        delete cleanInfData.password;
        

        const consultationData = { 
            userId: userData._id, // Ensure we use the ID from the fetched user document
            infId: infData._id, // Ensure we use the ID from the fetched inf document
            userData, // The fetched user data (without password)
            infData: cleanInfData, // The cleaned influencer data
            amount, // FIXED: Dynamic amount from infData.rates[mode]
            slotTime,
            slotDate,
            mode,
            date: Date.now() // Required
        }

        const newConsultation = new consultationModel(consultationData) 
        await newConsultation.save()

        // save new slots data in infData
        await influencerModel.findByIdAndUpdate(infId, { slots_booked }) 

        res.json({ success: true, message: 'Consultation Booked' }) 
    } catch (error) {
        console.log(error)
        // Send a more specific error for Mongoose validation, if possible
        if (error.name === 'ValidationError') {
             return res.json({ success: false, message: error.message })
        }
        res.json({ success: false, message: 'Server Error: ' + error.message })
    }

}

// API to cancel consultation
const cancelConsultation = async (req, res) => { 
    try {

        const { userId, consultationId } = req.body
        const consultationData = await consultationModel.findById(consultationId) 

        // verify consultation user 
        if (!consultationData || consultationData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action or Consultation not found' })
        }

        await consultationModel.findByIdAndUpdate(consultationId, { cancelled: true })

        // releasing influencer slot 
        const { infId, slotDate, slotTime } = consultationData 

        const influencerData = await influencerModel.findById(infId) 
        let slots_booked = influencerData.slots_booked

        // Ensure slots_booked[slotDate] is an array before filtering
        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        }

        await influencerModel.findByIdAndUpdate(infId, { slots_booked }) 

        res.json({ success: true, message: 'Consultation Cancelled' }) 
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user consultations for frontend my-consultations page
const listConsultation = async (req, res) => { 
    try {

        const { userId } = req.body
        const consultations = await consultationModel.find({ userId }) 
        res.json({ success: true, consultations })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// // API to make payment of consultation using razorpay
// const paymentRazorpay = async (req, res) => {
// 	try {

// 		const { consultationId } = req.body
// 		const consultationData = await consultationModel.findById(consultationId) 

// 		if (!consultationData || consultationData.cancelled) {
// 			return res.json({ success: false, message: 'Consultation Cancelled or not found' }) 
// 		}

// 		// creating options for razorpay payment
// 		const options = {
// 			amount: consultationData.amount * 100,
// 			currency: process.env.CURRENCY,
// 			receipt: consultationId,
// 		}

// 		// creation of an order
// 		const order = await razorpayInstance.orders.create(options)

// 		res.json({ success: true, order })

// 	} catch (error) {
// 		console.log(error)
// 		res.json({ success: false, message: error.message })
// 	}
// }

// // API to verify payment of razorpay
// const verifyRazorpay = async (req, res) => {
// 	try {
// 		const { razorpay_order_id } = req.body
// 		const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

// 		if (orderInfo.status === 'paid') {
// 			await consultationModel.findByIdAndUpdate(orderInfo.receipt, { payment: true }) 
// 			res.json({ success: true, message: "Payment Successful" })
// 		}
// 		else {
// 			res.json({ success: false, message: 'Payment Failed' })
// 		}
// 	} catch (error) {
// 		console.log(error)
// 		res.json({ success: false, message: error.message })
// 	}
// }

// // API to make payment of consultation using Stripe
// const paymentStripe = async (req, res) => {
// 	try {

// 		const { consultationId } = req.body
// 		const { origin } = req.headers

// 		const consultationData = await consultationModel.findById(consultationId) 

// 		if (!consultationData || consultationData.cancelled) {
// 			return res.json({ success: false, message: 'Consultation Cancelled or not found' })
// 		}

// 		const currency = process.env.CURRENCY.toLocaleLowerCase()

// 		const line_items = [{
// 			price_data: {
// 				currency,
// 				product_data: {
// 					name: "Consultation Fees" 
// 				},
// 				unit_amount: consultationData.amount * 100
// 			},
// 			quantity: 1
// 		}]

// 		const session = await stripeInstance.checkout.sessions.create({
// 			success_url: `${origin}/verify?success=true&consultationId=${consultationData._id}`,
// 			cancel_url: `${origin}/verify?success=false&consultationId=${consultationData._id}`,
// 			line_items: line_items,
// 			mode: 'payment',
// 		})

// 		res.json({ success: true, session_url: session.url });

// 	} catch (error) {
// 		console.log(error)
// 		res.json({ success: false, message: error.message })
// 	}
// }

// const verifyStripe = async (req, res) => {
// 	try {

// 		const { consultationId, success } = req.body

// 		if (success === "true") {
// 			await consultationModel.findByIdAndUpdate(consultationId, { payment: true })
// 			return res.json({ success: true, message: 'Payment Successful' })
// 		}

// 		res.json({ success: false, message: 'Payment Failed' })

// 	} catch (error) {
// 		console.log(error)
// 		res.json({ success: false, message: error.message })
// 	}
// }



export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookConsultation, 
    listConsultation, 
    cancelConsultation, 
    //  paymentRazorpay,
    //  verifyRazorpay,
    // paymentStripe,
    // verifyStripe
}