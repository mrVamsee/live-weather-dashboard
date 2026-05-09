import { celsiusToFahrenheit, formatTemp } from '../../utils/units';

describe('celsiusToFahrenheit', () => {
  test('converts 0°C to 32°F', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });

  test('converts 100°C to 212°F', () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  test('converts -40°C to -40°F', () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });

  test('converts 37°C to 99°F (rounds correctly)', () => {
    expect(celsiusToFahrenheit(37)).toBe(99);
  });
});

describe('formatTemp', () => {
  test('formats in Celsius', () => {
    expect(formatTemp(25, 'C')).toBe('25°C');
  });

  test('formats in Fahrenheit', () => {
    expect(formatTemp(0, 'F')).toBe('32°F');
  });

  test('rounds Celsius values', () => {
    expect(formatTemp(25.7, 'C')).toBe('26°C');
  });
});
