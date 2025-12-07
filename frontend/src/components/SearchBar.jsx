import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../contex/AppContext";
import { HiSearch } from "react-icons/hi";

const SearchBar = ({ className = "" }) => {
  const navigate = useNavigate();
  const { backendUrl, searchInfluencers } = useContext(AppContext || {});
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const cacheRef = useRef({});
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const fetchResults = async (q) => {
    if (!q || q.trim() === "") {
      setResults([]);
      return;
    }

    if (cacheRef.current[q]) {
      setResults(cacheRef.current[q]);
      return;
    }

    try {
      let influencers = [];

      if (typeof searchInfluencers === "function") {
        influencers = await searchInfluencers(q);
      } else {
        const { data } = await axios.post(
          backendUrl + "/api/influencer/search",
          { query: q },
          { headers: {} }
        );
        if (data && data.success) influencers = data.influencers || [];
        else influencers = [];
      }

      cacheRef.current[q] = influencers;
      setResults(influencers);
    } catch (err) {
      console.error("SearchBar fetch error:", err);
      setResults([]);
    }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query || query.trim() === "") {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchResults(query.trim());
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleChange = (e) => setQuery(e.target.value);

  const handleSelect = (inf) => {
    if (!inf || !inf._id) return;
    setQuery("");
    setResults([]);
    navigate(`/consultation/${inf._id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const exact = results.find(
      (r) => r.name && r.name.toLowerCase() === query.trim().toLowerCase()
    );
    if (exact) return handleSelect(exact);

    navigate(`/influencers?search=${encodeURIComponent(query.trim())}`);
    setResults([]);
  };

  return (
    <div className={`relative ${className} w-full sm:max-w-md`} style={{ minWidth: 220, zIndex: 50 }}>
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          placeholder="Search influencer..."
          className="h-9 flex-1 border rounded-l-md p-2 outline-none text-sm sm:text-base"
        />
        <button
          type="submit"
          className="bg-[#1999d5] text-white p-2 rounded-r-md flex items-center justify-center hover:bg-[#1999d5]/90 transition-colors"
        >
          <HiSearch className="w-5 h-5" />
        </button>
      </form>

      {results && results.length > 0 && (
        <ul className="absolute left-0 right-0 sm:right-auto bg-white border mt-1 rounded shadow-lg z-50 max-h-64 sm:max-h-80 overflow-y-auto w-full sm:w-auto">
          {results.map((inf) => (
            <li
              key={inf._id}
              onClick={() => handleSelect(inf)}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
            >
              {inf.image ? (
                <img src={inf.image} alt={inf.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{inf.name}</div>
                <div className="text-xs text-gray-500 truncate">{inf.category}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
