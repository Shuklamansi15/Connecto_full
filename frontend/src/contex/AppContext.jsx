import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [Influencers, setInfluencers] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
    const [userData, setUserData] = useState(null);

    // -----------------------------------------------------------------
    // ⭐ 1. PUBLIC INFLUENCERS LIST
    // -----------------------------------------------------------------
    const getInfluencersData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/influencer/list",
                { headers: {} }
            );

            if (data.success) {
                setInfluencers(data.influencers);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // -----------------------------------------------------------------
    // ⭐ NEW — SEARCH INFLUENCERS (USED BY SEARCH BAR)
    // -----------------------------------------------------------------
    const searchInfluencers = async (query) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/influencer/search",
                { query },
                { headers: {} }
            );

            if (data.success) {
                return data.influencers;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    // -----------------------------------------------------------------
    // ⭐ 2. ADMIN — GET ALL INFLUENCERS
    // -----------------------------------------------------------------
    const getAllInfluencersAdmin = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/admin/all-influencers",
                { headers: { aToken } }
            );

            if (data.success) {
                setInfluencers(data.influencers);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // -----------------------------------------------------------------
    // ⭐ 3. USER PROFILE
    // -----------------------------------------------------------------
    const loadUserProfileData = async () => {
        if (!token) return;

        try {
            const { data } = await axios.get(
                backendUrl + "/api/user/get-profile",
                { headers: { token } }
            );

            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                setToken("");
                setUserData(null);
            }

            toast.error(error.message);
        }
    };

    // -----------------------------------------------------------------
    // ⭐ 4. USER LOGIN
    // -----------------------------------------------------------------
    const loginUser = async (email, password) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/login",
                { email, password },
                { headers: {} }
            );

            if (data.success) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                toast.success("Login successful!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // -----------------------------------------------------------------
    // ⭐ 5. USER SIGNUP
    // -----------------------------------------------------------------
    const signupUser = async (name, email, password) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/register",
                { name, email, password },
                { headers: {} }
            );

            if (data.success) {
                toast.success("Account created!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // -----------------------------------------------------------------
    // ⭐ 6. BOOK A CONSULTATION
    // -----------------------------------------------------------------
    const bookConsultation = async (infId, consultationType, amount, date, slot) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/consultation/book",
                { infId, consultationType, amount, date, slot },
                { headers: { token } }
            );

            if (data.success) {
                toast.success("Consultation booked!");
                return data;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // -----------------------------------------------------------------
    // ⭐ AUTO LOAD
    // -----------------------------------------------------------------
    useEffect(() => {
        getInfluencersData();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(null);
        }
    }, [token]);

    const value = {
        currencySymbol,
        backendUrl,

        token,
        setToken,
        aToken,
        setAToken,

        userData,
        setUserData,

        getInfluencersData,
        getAllInfluencersAdmin,
        loadUserProfileData,
        bookConsultation,
        loginUser,
        signupUser,

        searchInfluencers, // <--- ADDED FOR SEARCH BAR

        Influencers,
        setInfluencers,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
