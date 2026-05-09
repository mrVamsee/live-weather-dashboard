import React from 'react';
import PropTypes from 'prop-types';
import './SearchHistory.css';

const SearchHistory = ({ history, onSelect, onRemove }) => {
    if (!history || history.length === 0) return null;

    return (
        <div className="history-container">
            <span className="history-label">Recent:</span>
            <div className="history-chips">
                {history.map((city) => (
                    <div className="history-chip" key={city}>
                        <button
                            className="chip-name"
                            onClick={() => onSelect(city)}
                            aria-label={`Search ${city}`}
                        >
                            {city}
                        </button>
                        <button
                            className="chip-remove"
                            onClick={() => onRemove(city)}
                            aria-label={`Remove ${city} from history`}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

SearchHistory.propTypes = {
    history: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelect: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default SearchHistory;
