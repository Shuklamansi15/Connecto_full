// src/components/SearchBar.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../contex/AppContext";


const SearchBar = ({ className = "" }) => {
  const navigate = useNavigate();
  const { backendUrl, searchInfluencers } = useContext(AppContext || {});
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const cacheRef = useRef({});
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch function: prefer context.searchInfluencers if available, else axios POST
  const fetchResults = async (q) => {
    if (!q || q.trim() === "") {
      setResults([]);
      return;
    }

    // cache hit
    if (cacheRef.current[q]) {
      setResults(cacheRef.current[q]);
      return;
    }

    try {
      let influencers = [];

      if (typeof searchInfluencers === "function") {
        // use the function you added in AppContext
        influencers = await searchInfluencers(q);
      } else {
        // fallback to axios POST using exact syntax you requested
        const { data } = await axios.post(
          backendUrl + "/api/influencer/search",
          { query: q },
          { headers: {} }
        );

        // Data shape expected: { success: true, influencers: [...] }
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

  // Debounced watcher
  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query || query.trim() === "") {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchResults(query.trim());
    }, 250); // 250ms debounce

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // if exact name match -> redirect
    const exact = results.find(
      (r) => r.name && r.name.toLowerCase() === query.trim().toLowerCase()
    );
    if (exact) return handleSelect(exact);
    // else go to influencers listing with search param
    navigate(`/influencers?search=${encodeURIComponent(query.trim())}`);
    setResults([]);
  };

  return (
    <div className={`relative ${className}`} style={{ minWidth: 220 }}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          placeholder="Search influencer..."
          className="w-full border rounded p-2 bg-white"
        />
        <button type="submit" className="ml-2 px-3 py-2">
          🔍
        </button>
      </form>

      {results && results.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border mt-1 rounded z-50 max-h-64 overflow-y-auto">
          {results.map((inf) => (
            <li
              key={inf._id}
              onClick={() => handleSelect(inf)}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
            >
              {inf.image ? (
                <img src={inf.image} alt={inf.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200" />
              )}
              <div>
                <div className="font-medium">{inf.name}</div>
                <div className="text-xs text-gray-500">{inf.category}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
