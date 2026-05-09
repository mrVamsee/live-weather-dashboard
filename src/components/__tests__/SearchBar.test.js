import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar/SearchBar';

const noop = () => {};

describe('SearchBar', () => {
  test('renders input and search button', () => {
    render(
      <SearchBar
        city=""
        setCity={noop}
        onSearch={noop}
        onGeolocate={noop}
        geoLoading={false}
      />
    );
    expect(screen.getByPlaceholderText(/enter city name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('calls onSearch when Search button is clicked', () => {
    const onSearch = jest.fn();
    render(
      <SearchBar
        city="London"
        setCity={noop}
        onSearch={onSearch}
        onGeolocate={noop}
        geoLoading={false}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  test('calls onSearch when Enter key is pressed', () => {
    const onSearch = jest.fn();
    render(
      <SearchBar
        city="Paris"
        setCity={noop}
        onSearch={onSearch}
        onGeolocate={noop}
        geoLoading={false}
      />
    );
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  test('does not call onSearch on other key presses', () => {
    const onSearch = jest.fn();
    render(
      <SearchBar
        city="Tokyo"
        setCity={noop}
        onSearch={onSearch}
        onGeolocate={noop}
        geoLoading={false}
      />
    );
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'a' });
    expect(onSearch).not.toHaveBeenCalled();
  });

  test('geo button is disabled when geoLoading is true', () => {
    render(
      <SearchBar
        city=""
        setCity={noop}
        onSearch={noop}
        onGeolocate={noop}
        geoLoading={true}
      />
    );
    expect(screen.getByRole('button', { name: /use my location/i })).toBeDisabled();
  });
});
