import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const [Influencers, setInfluencers] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
    const [userData, setUserData] = useState(null);

    // ⭐ NEW — Notification State (Replacement of Toast)
    const [notification, setNotification] = useState({
        show: false,
        type: "success",
        message: "",
    });

    const showNotification = (message, type = "success") => {
        setNotification({ show: true, type, message });

        setTimeout(() => {
            setNotification({ show: false, type: "success", message: "" });
        }, 2500);
    };

    // ⭐ 1. PUBLIC INFLUENCERS LIST
    const getInfluencersData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/influencer/list",
                { headers: {} }
            );

            if (data.success) {
                setInfluencers(data.influencers);
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification(error.message, "error");
        }
    };

    // ⭐ NEW — SEARCH INFLUENCERS
    const searchInfluencers = async (query) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/influencer/search",
                { query },
                { headers: {} }
            );

            if (data.success) return data.influencers;
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    // ⭐ 2. ADMIN — GET ALL INFLUENCERS
    const getAllInfluencersAdmin = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/admin/all-influencers",
                { headers: { aToken } }
            );

            if (data.success) {
                setInfluencers(data.influencers);
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification(error.message, "error");
        }
    };

    // ⭐ 3. USER PROFILE
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
                showNotification(data.message, "error");
            }
        } catch (error) {

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                setToken("");
                setUserData(null);
            }

            showNotification(error.message, "error");
        }
    };

    // ⭐ 4. USER LOGIN
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
                showNotification("Login successful!", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification(error.message, "error");
        }
    };

    // ⭐ 5. USER SIGNUP
    const signupUser = async (name, email, password) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/user/register",
                { name, email, password },
                { headers: {} }
            );

            if (data.success) {
                showNotification("Account created!", "success");
            } else {
                showNotification(data.message, "error");
            }
        } catch (error) {
            showNotification(error.message, "error");
        }
    };

    // ⭐ 6. BOOK A CONSULTATION
    const bookConsultation = async (infId, consultationType, amount, date, slot) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/consultation/book",
                { infId, consultationType, amount, date, slot },
                { headers: { token } }
            );

            if (data.success) {
                showNotification("Consultation booked!", "success");
                return data;
            } else {
                showNotification(data.message, "error");
                return null;
            }
        } catch (error) {
            showNotification(error.message, "error");
            return null;
        }
    };

    // AUTO LOAD
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

        searchInfluencers,

        Influencers,
        setInfluencers,

        notification,
        showNotification,
        setNotification
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
