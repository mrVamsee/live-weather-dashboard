import { getAQIDesc } from '../../utils/aqi';

describe('getAQIDesc', () => {
  const cases = [
    [1, 'Good', '#4caf50'],
    [2, 'Moderate', '#ffeb3b'],
    [3, 'Unhealthy for Sensitive Groups', '#ff9800'],
    [4, 'Unhealthy', '#f44336'],
    [5, 'Very Unhealthy', '#9c27b0'],
    [6, 'Hazardous', '#7e0023'],
  ];

  test.each(cases)(
    'index %i returns text "%s" and color "%s"',
    (index, text, color) => {
      const result = getAQIDesc(index);
      expect(result.text).toBe(text);
      expect(result.color).toBe(color);
    }
  );

  test('unknown index returns Unknown with grey color', () => {
    const result = getAQIDesc(99);
    expect(result.text).toBe('Unknown');
    expect(result.color).toBe('#999');
  });
});
