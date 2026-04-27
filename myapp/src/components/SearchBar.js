import React from 'react';

const SearchBar = ({ city, setCity, onSearch }) => {
  // Handles the Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && city.trim() !== "") {
      onSearch();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="city-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        onKeyDown={handleKeyDown}
      />
      <button 
        className="search-btn"
        onClick={() => city.trim() !== "" && onSearch()}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;