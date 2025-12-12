import React, { useContext, useEffect, useState, useMemo } from "react";
// Import necessary icons
import { FaUserTie, FaUsers, FaChartPie, FaRupeeSign, FaSortUp, FaSortDown, FaSort } from "react-icons/fa";
import { BsChatTextFill, BsFillTelephoneFill, BsCameraVideoFill } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";

import { AdminContext } from "../../context/AdminContext"; // your context
import { assets } from "../../assets/assets"; // optional: default images

// Define the primary color for reuse
const PRIMARY_COLOR = "#1999d5";

// =================================================================================
// 1. USE SORTABLE DATA HOOK (Internal Helper Function)
// This function handles the sorting logic without changing component state directly.
// =================================================================================
const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    // Use useMemo to re-sort the data only when 'items' or 'sortConfig' changes
    const sortedItems = useMemo(() => {
        if (!items) return [];
        let sortableItems = [...items];

        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                // Ensure the value exists and is compared correctly
                const aValue = a[sortConfig.key] || 0;
                const bValue = b[sortConfig.key] || 0;

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

// =================================================================================
// 2. PIE CHART COMPONENT (from previous iteration)
// =================================================================================
const PreferredModePieChart = ({ percentages }) => {
    const chatP = percentages?.chat || 0;
    const callP = percentages?.call || 0;
    const videoP = percentages?.video || 0;

    const chatEnd = chatP;
    const callStart = chatEnd;
    const callEnd = chatEnd + callP;

    const pieChartStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: `conic-gradient(
            ${PRIMARY_COLOR} 0% ${chatEnd}%,
            #ffc107 ${callStart}% ${callEnd}%,
            #dc3545 ${callEnd}% 100%
        )`,
        minWidth: '40px',
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative">
                <div style={pieChartStyle} className="shadow-md"></div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white leading-none"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    {Math.max(chatP, callP, videoP).toFixed(0)}%
                </span>
            </div>
            <div className="flex flex-wrap gap-x-3 text-xs font-medium text-gray-700 mt-2">
                <span className="flex items-center">
                    <BsChatTextFill className="mr-1" style={{ color: PRIMARY_COLOR }} />Chat
                </span>
                <span className="flex items-center">
                    <BsFillTelephoneFill className="mr-1" style={{ color: '#ffc107' }} />Call
                </span>
                <span className="flex items-center">
                    <BsCameraVideoFill className="mr-1" style={{ color: '#dc3545' }} />Video
                </span>
            </div>
        </div>
    );
};

// =================================================================================
// 3. MAIN COMPONENT
// =================================================================================
const AdminInfluencerStats = () => {
    const { getInfluencersStats } = useContext(AdminContext);
    const [rawStats, setRawStats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Use the custom sorting logic here
    const { items: stats, requestSort, sortConfig } = useSortableData(rawStats, { key: 'totalRevenue', direction: 'descending' });

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const res = await getInfluencersStats();
            if (res.success && res.data) {
                setRawStats(res.data); // Store the original fetched data
            } else {
                setRawStats([]);
                console.log("No data or failed:", res.message);
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    // Helper function to render the correct sort icon
    const getSortIcon = (key) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <FaSort className="text-gray-400 ml-1" />;
        }
        if (sortConfig.direction === 'ascending') {
            return <FaSortUp className="text-gray-600 ml-1" style={{ color: PRIMARY_COLOR }} />;
        }
        return <FaSortDown className="text-gray-600 ml-1" style={{ color: PRIMARY_COLOR }} />;
    };


    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center h-40 w-full">
                <svg className="animate-spin h-6 w-6 mr-3 text-gray-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-500">Loading influencer statistics...</span>
            </div>
        );
    }

    if (stats.length === 0) {
        return <div className="p-8 text-center text-lg text-gray-500 bg-white rounded-xl shadow-lg m-4 w-full">😔 No influencer stats available at the moment.</div>;
    }

    // Keys that are sortable
    const sortableKeys = {
        'totalConsultations': 'Total Consultations',
        'uniqueUsers': 'Unique Users',
        'totalRevenue': 'Revenue (₹)'
    };

    // Helper component for sortable columns
    const SortableHeader = ({ sortKey, title, icon: IconComponent }) => (
        <th 
            className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 cursor-pointer hover:bg-gray-200 transition duration-150"
            onClick={() => requestSort(sortKey)}
        >
            <div className="flex items-center justify-center">
                <IconComponent className="inline mr-2 text-base" /> 
                {title}
                {getSortIcon(sortKey)}
            </div>
        </th>
    );

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen w-full">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-2 flex items-center" style={{ color: PRIMARY_COLOR }}>
                <RiDashboardFill className="mr-3 text-4xl" /> Influencer Performance Dashboard
            </h1>
            
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
                                {/* Influencer (Not Sortable) */}
                                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    <FaUserTie className="inline mr-2 text-base" /> Influencer
                                </th>

                                {/* Sortable Columns */}
                                <SortableHeader 
                                    sortKey="totalConsultations" 
                                    title="Total Consultations" 
                                    icon={FaUsers} 
                                />
                                {/* Preferred Mode (Not Sortable) */}
                                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                    <FaChartPie className="inline mr-2 text-base" /> Preferred Mode
                                </th>
                                <SortableHeader 
                                    sortKey="uniqueUsers" 
                                    title="Unique Users" 
                                    icon={FaUsers} 
                                />
                                <SortableHeader 
                                    sortKey="totalRevenue" 
                                    title="Revenue (₹)" 
                                    icon={FaRupeeSign} 
                                />
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-100">
                            {stats.map((item) => (
                                <tr 
                                    key={item.influencerId} 
                                    className="hover:bg-blue-50 transition duration-150 ease-in-out"
                                >
                                    {/* Influencer */}
                                    <td className="p-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.image || assets.default_user}
                                                className="w-12 h-12 rounded-full object-cover border-2"
                                                style={{ borderColor: PRIMARY_COLOR }}
                                                alt={item.name}
                                            />
                                            <div>
                                                <p className="font-bold text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Total Consultations */}
                                    <td className="p-4 whitespace-nowrap text-center text-lg font-medium text-gray-700">
                                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-bold">
                                            {item.totalConsultations}
                                        </span>
                                    </td>

                                    {/* Preferred Mode (Pie Chart) */}
                                    <td className="p-4 whitespace-nowrap text-center">
                                        <PreferredModePieChart 
                                            percentages={item.preferredModePercent} 
                                        />
                                    </td>

                                    {/* Unique Users */}
                                    <td className="p-4 whitespace-nowrap text-center text-lg font-medium text-gray-700">
                                        {item.uniqueUsers || 0}
                                    </td>

                                    {/* Revenue */}
                                    <td className="p-4 whitespace-nowrap text-center text-lg font-extrabold" style={{ color: PRIMARY_COLOR }}>
                                        ₹{item.totalRevenue ? item.totalRevenue.toLocaleString('en-IN') : 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <p className="mt-6 text-sm text-gray-500 text-center">Data refreshed upon component load. Click on 'Consultations', 'Unique Users', or 'Revenue' to sort the table.</p>
        </div>
    );
};

export default AdminInfluencerStats;