import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatTemp } from '../../utils/units';
import './ForecastStrip.css';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ForecastStrip = ({ forecastData, unit, title }) => {
    const scrollRef = useRef(null);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const check = () => {
            setShowHint(el.scrollWidth > el.clientWidth && el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
        };

        check();
        el.addEventListener('scroll', check);
        window.addEventListener('resize', check);
        return () => {
            el.removeEventListener('scroll', check);
            window.removeEventListener('resize', check);
        };
    }, [forecastData]);

    if (!forecastData || forecastData.length === 0) return null;

    const isDaily = !!forecastData[0].date; // daily cards have a date string

    return (
        <div className="forecast-strip">
            <h3 className="forecast-title">{title || '5-Day Forecast'}</h3>
            <div className="forecast-scroll-wrapper">
                <div className="forecast-scroll" ref={scrollRef}>
                    {forecastData.map((item, idx) => {
                        let label;
                        if (isDaily) {
                            const date = new Date(item.date + 'T12:00:00');
                            label = idx === 0 ? 'Today' : DAY_NAMES[date.getDay()];
                        } else {
                            label = item.time; // hourly: already formatted
                        }

                        return (
                            <div className="forecast-card" key={isDaily ? item.date : item.time}>
                                <span className="forecast-day">{label}</span>
                                <img
                                    src={item.icon}
                                    alt={item.condition}
                                    className={isDaily ? 'forecast-icon' : 'forecast-icon-sm'}
                                />
                                {isDaily ? (
                                    <>
                                        <span className="forecast-high temp-animated">{formatTemp(item.maxTemp, unit)}</span>
                                        <span className="forecast-low temp-animated">{formatTemp(item.minTemp, unit)}</span>
                                    </>
                                ) : (
                                    <span className="forecast-high temp-animated">{formatTemp(item.temp, unit)}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
                {showHint && <span className="scroll-hint" aria-hidden="true">›</span>}
            </div>
        </div>
    );
};

ForecastStrip.propTypes = {
    forecastData: PropTypes.array.isRequired,
    unit: PropTypes.oneOf(['C', 'F']).isRequired,
    title: PropTypes.string,
};

export default ForecastStrip;
