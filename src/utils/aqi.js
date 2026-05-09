export const getAQIDesc = (index) => {
  const levels = {
    1: { text: 'Good', color: '#4caf50' },
    2: { text: 'Moderate', color: '#ffeb3b' },
    3: { text: 'Unhealthy for Sensitive Groups', color: '#ff9800' },
    4: { text: 'Unhealthy', color: '#f44336' },
    5: { text: 'Very Unhealthy', color: '#9c27b0' },
    6: { text: 'Hazardous', color: '#7e0023' },
  };
  return levels[index] || { text: 'Unknown', color: '#999' };
};
