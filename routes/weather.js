import express from 'express';
const router = express.Router();
import { getWeatherById, insertWeatherData, insertMultipleWeatherData, deleteWeatherData, getWeatherByStationAndDateTime, getMaxTemperature, getMaxPrecipitation, getWeatherByTemperatureAndHumidity, updatePrecipitation } from '../controllers/weatherController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';


// Specific routes with more parameters
router.route('/weather/max-temperature').get(getMaxTemperature);
router.route('/weather/:deviceName/max-precipitation').get(getMaxPrecipitation);
router.route('/weather/:deviceName/:time').get(getWeatherByStationAndDateTime);
router.route('/weather/temperature-humidity').get(getWeatherByTemperatureAndHumidity);

// Routes with :id parameter
router.route('/weather/:id').get(getWeatherById);
router.route('/weather/:id').delete(isAuthenticated, authorizeRoles('admin', 'teacher'), deleteWeatherData);
router.route('/weather/:id/precipitation').put(isAuthenticated, authorizeRoles('admin', 'teacher'), updatePrecipitation);

// Data insertion routes
router.route('/weather').post(isAuthenticated, authorizeRoles('sensor'), insertWeatherData);
router.route('/weather/multiple').post(isAuthenticated, authorizeRoles('sensor'), insertMultipleWeatherData);




export default router;