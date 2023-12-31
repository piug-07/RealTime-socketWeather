// Import necessary modules
const express = require('express');
const http = require('http');
const axios = require('axios');
const socketIO = require('socket.io');
const cors = require('cors');
require('dotenv').config();



// Create Express app and server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Use cors middleware
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});




const apiKey = 'e412630bd1814029a8d2078ba87bf5bc';

const getLocationFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
    );

    if (response.data.results.length > 0) {
      // const location = response.data.results[0].formatted;
      const location = response.data.results[0].components.city + "," + " " + response.data.results[0].components.state;
      console.log('Location:', location);
      return location;
    } else {
      console.error('No location found');
      return null;
    }
  } catch (error) {
    console.error('Error getting location:', error.message);
    return null;
  }
};

// Example usage
// const latitude = 40.7128; // Example latitude
// const longitude = -74.0060; // Example longitude



// API endpoint to fetch weather
app.post('/api/weather', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const location = await getLocationFromCoordinates(latitude, longitude);

    // Convert coordinates to location name using geocoding

    // Fetch weather data from a weather API (replace with your API key and URL)
    const weatherResponse = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=59ce1d42a9ce4776831210710233012&q=${latitude},${longitude}`
    );

    const { temp_c, condition, wind_kph, humidity, cloud , wind_dir} = weatherResponse.data.current;
    const RealTimedata = weatherResponse.data.current
    console.log(weatherResponse.data.current)

    // Send response to the client
    res.json({
      location,
      // RealTimedata
      temperature: temp_c,
      conditions: condition.text,
      conditionsIcon: condition.icon,
      windSpeed: wind_kph,
      humidity:humidity,
      cloud:cloud,
      wind_dir:wind_dir
      // Additional weather data...
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Periodically update weather data and emit to connected clients
setInterval(async () => {
  try {
    // Fetch updated weather data
    const updatedWeatherData = await axios.post('http://localhost:3000/api/weather', {
      latitude: 40.7128, // Example latitude
      longitude: -74.0060, // Example longitude
    });

    // Emit updated data to all connected clients
    io.emit('weatherUpdate', updatedWeatherData.data);
  } catch (error) {
    console.error('Error updating weather data:', error);
  }
}, 30000); // Update every 30 seconds

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
