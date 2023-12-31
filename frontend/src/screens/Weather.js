import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        // Function to fetch weather data based on user's location
        const fetchWeatherData = async (latitude, longitude) => {
            try {
                const response = await axios.post('http://localhost:5000/api/weather', { latitude, longitude });
                setWeatherData(response.data);
            } catch (error) {
                console.error('Error fetching weather data:', error.message);
            }
        };

        // Get user's current location using Geolocation API
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherData(latitude, longitude)
                },
                (error) => {
                    console.error('Error getting user location:', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []); // Run effect only once on component mount
    console.log(weatherData)
    return (
        <div>
            {weatherData ? (
                <div>
                    <h2>Current Weather</h2>
                    <p>Location: {weatherData.location}</p>
                    <p>Temperature: {weatherData.temperature}°C</p>
                    <p>Conditions: {weatherData.conditions}</p>
                    {/* Additional weather data... */}
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>
    );
};

export default Weather;
