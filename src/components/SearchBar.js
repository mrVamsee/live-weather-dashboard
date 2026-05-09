import React from 'react';

const SearchBar = ({ city, setCity, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
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
        placeholder="Enter city name"
        
        onKeyDown={handleKeyDown}
      />

      <button className="search-btn" onClick={onSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;