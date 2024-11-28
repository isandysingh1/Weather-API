import mongoose from 'mongoose';

// Define the weather data schema
const weatherSchema = new mongoose.Schema({
  "Device Name": {
    type: String,
    required: [true, 'Device name is required'],
  },
  "Precipitation mm/h": {
    type: Number,
    required: [true, 'Precipitation is required'],
    double: true,
  },
  "Time": {
    type: Date,
    required: [true, 'Time is required'],
  },
  "Latitude": {
    type: Number,
    required: [true, 'Latitude is required'],
    double: true,
  },
  "Longitude": {
    type: Number,
    required: [true, 'Longitude is required'],
    double: true,
  },
  "Temperature (°C)": {
    type: Number,
    required: [true, 'Temperature is required'],
    double: true,
  },
  "Atmospheric Pressure (kPa)": {
    type: Number,
    required: [true, 'Atmospheric pressure is required'],
    double: true,
  },
  "Max Wind Speed (m/s)": {
    type: Number,
    required: [true, 'Maximum wind speed is required'],
    double: true,
  },
  "Solar Radiation (W/m2)": {
    type: Number,
    required: [true, 'Solar radiation is required'],
  },
  "Vapor Pressure (kPa)": {
    type: Number,
    required: [true, 'Vapor pressure is required'],
    double: true,
  },
  "Humidity (%)": {
    type: Number,
    required: [true, 'Humidity is required'],
    double: true,
  },
  "Wind Direction (°)": {
    type: Number,
    required: [true, 'Wind direction is required'],
    double: true,
  }
}, { collection: 'weatherData' });

// Index
weatherSchema.index({ "Temperature (°C)": 1, "Time": 1 });
weatherSchema.index({ "Humidity (%)": 1, "Precipitation mm/h": 1, "Time": 1 });
weatherSchema.index({ "Device Name": 1, "Time": 1 });

// Create the Weather model using the schema
const Weather = mongoose.model('Weather', weatherSchema);

export default Weather;