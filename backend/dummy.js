const axios = require('axios');

// Replace 'your_api_key' with your OpenCage API key
const apiKey = 'e412630bd1814029a8d2078ba87bf5bc';

const getLocationFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
    );

    if (response.data.results.length > 0) {
      const location = response.data.results[0].formatted;
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
const latitude = 40.7128; // Example latitude
const longitude = -74.0060; // Example longitude

getLocationFromCoordinates(latitude, longitude);
