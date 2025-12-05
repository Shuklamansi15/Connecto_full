import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [aToken, setAToken] = useState(
        localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
    );

    const [consultations, setConsultations] = useState([]);
    const [influencers, setInfluencers] = useState([]);
    const [dashData, setDashData] = useState(null);

    // ========================= GET ALL INFLUENCERS =========================
    const getAllInfluencers = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/admin/all-influencers',
                { headers: { aToken } }
            );

            if (data.success) {
                setInfluencers(data.influencers);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    };

    // ========================= CHANGE AVAILABILITY =========================
    const changeAvailability = async (infId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/change-availability',
                { infId },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllInfluencers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    };

    // ========================= GET ALL CONSULTATIONS =========================
    const getAllConsultations = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/admin/consultations',
                { headers: { aToken } }
            );

            if (data.success) {
                setConsultations(data.consultations);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    };

    // ========================= CANCEL CONSULTATION =========================
    const cancelConsultation = async (consultationId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/cancel-consultation',
                { consultationId },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllConsultations();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    };

    // ========================= GET DASHBOARD DATA =========================
    const getDashData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/admin/dashboard',
                { headers: { aToken } }
            );

            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    };

    // ========================= CONTEXT VALUE =========================
    const value = {
        aToken,
        setAToken,

        influencers,
        getAllInfluencers,
        changeAvailability,

        consultations,
        getAllConsultations,

        cancelConsultation,

        dashData,
        getDashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
