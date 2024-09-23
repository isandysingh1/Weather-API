import express from 'express';
const router = express.Router();
import { getWeatherById, insertWeatherData, insertMultipleWeatherData, updateWeatherData, deleteWeatherData,  getHumidityRainfallData, getWeatherByStationAndDateTime, getMaxTemperature, updatePrecipitation, getMaxPrecipitation } from '../controllers/weatherController.js';


// Specific routes with more parameters
router.route('/weather/max-temperature').get(getMaxTemperature);
router.route('/weather/:deviceName/max-precipitation').get(getMaxPrecipitation);
router.route('/weather/:deviceName/:time').get(getWeatherByStationAndDateTime);

// General routes
router.route('/weather/humidity-rainfall').get(getHumidityRainfallData);

// Routes with :id parameter
router.route('/weather/:id').get(getWeatherById);
router.route('/weather/:id').put(updateWeatherData);
router.route('/weather/:id/precipitation').put(updatePrecipitation);
router.route('/weather/:id').delete(deleteWeatherData);

// Data insertion routes
router.route('/weather').post(insertWeatherData);
router.route('/weather/multiple').post(insertMultipleWeatherData);




export default router;