import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // ------------------------------
  // ✔ Correct Month Names
  // ------------------------------
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // ----------------------------------------------------------
  // 🔥 ADDED ONLY THIS (NotificationCard Logic)
  // ----------------------------------------------------------
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message, title) => {
    setNotification({ type, message, title });
  };

  const hideNotification = () => {
    setNotification(null);
  };
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // ✔ Universal Date Formatter (Safe for ALL formats)
  // ----------------------------------------------------------
  const slotDateFormat = (dateInput) => {
    if (!dateInput) return "Invalid Date";

    let date;

    if (typeof dateInput === "string" && dateInput.includes("_")) {
      const parts = dateInput.split("_");
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        if (day && month && year) {
          date = new Date(year, month - 1, day);
        }
      }
    }

    if (!date || isNaN(date.getTime())) {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return "Invalid Date";

    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  // ----------------------------------------------------------
  // ✔ Correct Age Calculator
  // ----------------------------------------------------------
  const calculateAge = (dob) => {
    if (!dob || typeof dob !== "string") return 0;

    const parts = dob.split("_");
    if (parts.length !== 3) return 0;

    const [day, month, year] = parts.map(Number);

    if (!day || !month || !year) return 0;

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    if (isNaN(birthDate.getTime())) return 0;

    let age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) age--;

    return age < 0 ? 0 : age;
  };

  // ----------------------------------------------------------
  // ✔ Safe Social Links Formatter
  // ----------------------------------------------------------
  const formatSocialLinks = (links) => {
    if (!links || typeof links !== "object") {
      return { instagram: "", youtube: "", twitter: "" };
    }
    return {
      instagram: links.instagram?.trim() || "",
      youtube: links.youtube?.trim() || "",
      twitter: links.twitter?.trim() || "",
    };
  };

  // ----------------------------------------------------------
  // ✔ Safe Rates Formatter
  // ----------------------------------------------------------
  const formatRates = (rates) => {
    if (!rates || typeof rates !== "object") {
      return { chat: 0, call: 0, video: 0 };
    }
    return {
      chat: Number(rates.chat) || 0,
      call: Number(rates.call) || 0,
      video: Number(rates.video) || 0,
    };
  };

  // ----------------------------------------------------------
  // ✔ Provider Values (ONLY ADDED 3 new values)
  // ----------------------------------------------------------
  const value = {
    backendUrl,
    currency,
    slotDateFormat,
    calculateAge,
    formatSocialLinks,
    formatRates,

    // 🔥 Added
    notification,
    showNotification,
    hideNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
