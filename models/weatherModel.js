import mongoose from 'mongoose';

// Define the weather data schema
const weatherSchema = new mongoose.Schema({
  deviceName: {
    type: String,  // The name of the sensor device
    required: [true, 'Device name is required'],
    alias: 'Device Name'
  },
  precipitation: {
    type: Number, // Precipitation measured in mm/h
    required: [true, 'Precipitation is required'],
    double: true,
    alias: 'Precipitation mm/h'
  },
  time: {
    type: Date,   // Timestamp for the data
    required: [true, 'Time is required'],
    alias: 'Time'
  },
  latitude: {
    type: Number, // Latitude of the sensor location
    required: [true, 'Latitude is required'],
    double: true,
    alias: 'Latitude'
  },
  longitude: {
    type: Number, // Longitude of the sensor location
    required: [true, 'Longitude is required'],
    double: true,
    alias: 'Longitude'
  },
  temperature: {
    type: Number, // Temperature measured in °C
    required: [true, 'Temperature is required'],
    double: true,
    validate: {
      validator: function(value) {
        return value >= -50 && value <= 60;
      },
      message: 'Temperature must be between -50°C and 60°C.'
    },
    alias: 'Temperature (°C)'
  },
  atmosphericPressure: {
    type: Number, // Atmospheric Pressure measured in kPa
    required: [true, 'Atmospheric pressure is required'],
    double: true,
    alias: 'Atmospheric Pressure (kPa)'
  },
  maxWindSpeed: {
    type: Number, // Maximum wind speed measured in m/s
    required: [true, 'Maximum wind speed is required'],
    double: true,
    alias: 'Max Wind Speed (m/s)'
  },
  solarRadiation: {
    type: Number, // Solar Radiation measured in W/m²
    required: [true, 'Solar radiation is required'],
    alias: 'Solar Radiation (W/m2)'
  },
  vaporPressure: {
    type: Number, // Vapor Pressure measured in kPa
    required: [true, 'Vapor pressure is required'],
    double: true,
    alias: 'Vapor Pressure (kPa)'
  },
  humidity: {
    type: Number, // Humidity percentage (%)
    required: [true, 'Humidity is required'],
    double: true,
    validate: {
      validator: function(value) {
        return value >= 0 && value <= 100;
      },
      message: 'Humidity must be between 0 and 100'
    },
    alias: 'Humidity (%)'
  },
  windDirection: {
    type: Number, // Wind direction in degrees (°)
    required: [true, 'Wind direction is required'],
    double: true,
    alias: 'Wind Direction (°)'
  }
}, { collection: 'weatherData' });

// Index
weatherSchema.index({ temperature: 1, time: 1 });
weatherSchema.index({ humidity: 1, precipitation: 1, time: 1 });
weatherSchema.index({ deviceName: 1, time: 1 });

// Create the Weather model using the schema
const Weather = mongoose.model('Weather', weatherSchema);

export default Weather;