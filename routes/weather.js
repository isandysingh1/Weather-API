import express from 'express';
const router = express.Router();
import { getWeatherById, insertWeatherData, insertMultipleWeatherData, deleteWeatherData, getWeatherByStationAndDateTime, getMaxTemperature, getMaxPrecipitation, getWeatherByTemperatureAndHumidity, updatePrecipitation } from '../controllers/weatherController.js';


// Specific routes with more parameters
router.route('/weather/max-temperature').get(getMaxTemperature);
router.route('/weather/:deviceName/max-precipitation').get(getMaxPrecipitation);
router.route('/weather/:deviceName/:time').get(getWeatherByStationAndDateTime);
router.route('/weather/temperature-humidity').get(getWeatherByTemperatureAndHumidity);

// Routes with :id parameter
router.route('/weather/:id').get(getWeatherById);
router.route('/weather/:id').delete(deleteWeatherData);
router.route('/weather/:id/precipitation').put(updatePrecipitation);

// Data insertion routes
router.route('/weather').post(insertWeatherData);
router.route('/weather/multiple').post(insertMultipleWeatherData);




export default router;