import React from 'react';
import PropTypes from 'prop-types';
import './ThemeToggle.css';

const ThemeToggle = ({ isDark, onToggle }) => (
    <button
        className="theme-toggle"
        onClick={onToggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Light mode' : 'Dark mode'}
    >
        {isDark ? '☀️' : '🌙'}
    </button>
);

ThemeToggle.propTypes = {
    isDark: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default ThemeToggle;
