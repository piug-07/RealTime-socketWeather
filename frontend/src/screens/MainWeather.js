import React, { useEffect, useState } from 'react'
import style from './style.module.css'
import axios from 'axios';

const MainWeather = () => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        // Function to fetch weather data based on user's location
        const fetchWeatherData = async (latitude, longitude) => {
            try {
                const response = await axios.post('http://localhost:3000/api/weather', { latitude, longitude });
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
        <div className={style.wrapper}>
            <div className={`${style.shape} ${style.shape_1}`}></div>
            <div className={`${style.shape} ${style.shape_2}`}></div>
            <div className={style.container}>
                {weatherData ? (
                    <div id={style.result}>
                        <h4>Current Location:</h4>
                        <h2>{weatherData.location}</h2>
                        <h4 className={style.weather}><b>{weatherData.conditions}</b></h4>
                        <h4 className={style.desc}>Wind Direction: <b>{weatherData.wind_dir}</b></h4>
                        <img src={weatherData.conditionsIcon} alt='' className={style.imgmain}/>
                        <h1>{weatherData.temperature}&#176;</h1>
                        <div className={style.temp_container}>
                            <div>
                                <h4 className={style.title}>humidity</h4>
                                <h4 className={style.temp}>{weatherData.humidity}</h4>
                            </div>
                            <div>
                                <h4 className={style.title}>windSpeed</h4>
                                <h4 className={style.temp}>{weatherData.windSpeed} Kph</h4>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading weather data...</p>
                )}
            </div>
        </div>
    )
}

export default MainWeather