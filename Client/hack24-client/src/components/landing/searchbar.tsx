import React from "react";
import { FaSearch } from "react-icons/fa";
import "./../../styles/landing/searchbar.css"; // Assuming you have a CSS file for styling

export default function SearchBar() {
    return (
        <div className="search-bar">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Buscar..." className="search-input" />
        </div>
    );
}