import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const InfluencerContext = createContext();

const InfluencerContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [iToken, setIToken] = useState(
        localStorage.getItem("iToken") ? localStorage.getItem("iToken") : ""
    );
    const [consultations, setConsultations] = useState([]);

    // 🚀 FIX: Initialize dashData as an object with all expected keys.
    // This prevents the dashboard component from throwing an error when trying to access 
    // dashData.latestConsultations.slice() before the API call completes.
    const [dashData, setDashData] = useState({
        earnings: 0,
        consultations: 0,
        users: 0,
        latestConsultations: [], // Crucial for array methods in the Dashboard component
    });
    
    const [profileData, setProfileData] = useState(false);

    // Get influencer consultations from backend
    const getConsultations = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/influencer/consultations", {
                headers: { iToken },
            });

            if (data.success) {
                // Ensure data.consultations is an array before calling reverse
                if (Array.isArray(data.consultations)) {
                    setConsultations(data.consultations.reverse());
                } else {
                    console.error("Consultations data is not an array:", data.consultations);
                    setConsultations([]); // Reset to empty array on unexpected format
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error); // Use console.error for actual errors
            toast.error(error.message);
        }
    };

    // Get influencer profile data from backend
    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/influencer/profile", {
                headers: { iToken },
            });

            if (data.success) {
                setProfileData(data.profileData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    // Cancel a consultation
    const cancelConsultation = async (consultationId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/influencer/cancel-consultation",
                { consultationId },
                { headers: { iToken } }
            );

            if (data.success) {
                toast.success(data.message);
                // Refresh data after action
                getConsultations();
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    // Mark a consultation as completed
    const completeConsultation = async (consultationId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/influencer/complete-consultation",
                { consultationId },
                { headers: { iToken } }
            );

            if (data.success) {
                toast.success(data.message);
                // Refresh data after action
                getConsultations();
                getDashData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    // Get influencer dashboard data
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/influencer/dashboard", {
                headers: { iToken },
            });

            if (data.success) {
                // Check if the response contains the expected object structure
                if (data.dashData) {
                    setDashData(data.dashData);
                    console.log(data.dashData);
                } else {
                    toast.error("Dashboard data structure is invalid.");
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const value = {
        iToken,
        setIToken,
        backendUrl,
        consultations,
        getConsultations,
        cancelConsultation,
        completeConsultation,
        dashData,
        getDashData,
        profileData,
        setProfileData,
        getProfileData,
    };

    return (
        <InfluencerContext.Provider value={value}>
            {props.children}
        </InfluencerContext.Provider>
    );
};

export default InfluencerContextProvider;