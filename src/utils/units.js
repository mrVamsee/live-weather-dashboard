/**
 * Convert Celsius to Fahrenheit.
 * @param {number} celsius
 * @returns {number}
 */
export const celsiusToFahrenheit = (celsius) =>
  Math.round((celsius * 9) / 5 + 32);

/**
 * Format a temperature value based on the current unit preference.
 * @param {number} celsius
 * @param {'C'|'F'} unit
 * @returns {string}
 */
export const formatTemp = (celsius, unit) =>
  unit === 'F'
    ? `${celsiusToFahrenheit(celsius)}°F`
    : `${Math.round(celsius)}°C`;
