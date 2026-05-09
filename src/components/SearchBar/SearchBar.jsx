import React from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

const SearchBar = ({ city, setCity, onSearch, onGeolocate, geoLoading }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') onSearch();
    };

    return (
        <div className="search-wrapper">
            <div className="search-container">
                <input
                    type="text"
                    className="city-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name..."
                    onKeyDown={handleKeyDown}
                    aria-label="City name"
                />
                <button className="search-btn" onClick={onSearch} aria-label="Search">
                    Search
                </button>
                <div className="geo-btn-wrapper">
                    <button
                        className="geo-btn"
                        onClick={onGeolocate}
                        disabled={geoLoading}
                        aria-label="Use my location"
                    >
                        {geoLoading ? <span className="geo-spinner" aria-hidden="true" /> : '📍'}
                    </button>
                    <span className="geo-tooltip" role="tooltip">Detect my location</span>
                </div>
            </div>
        </div>
    );
};

SearchBar.propTypes = {
    city: PropTypes.string.isRequired,
    setCity: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onGeolocate: PropTypes.func.isRequired,
    geoLoading: PropTypes.bool.isRequired,
};

export default SearchBar;
