import express from 'express';
const router = express.Router();
import { getWeatherById, insertWeatherData, insertMultipleWeatherData, deleteWeatherData, getWeatherByStationAndDateTime, getMaxTemperature, getMaxPrecipitation, getWeatherByTemperatureAndHumidity, updatePrecipitation } from '../controllers/weatherController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/auth.js';



router.route('/weather/max-temperature').get(isAuthenticated, authorizeRoles('Admin', 'Teacher', 'Student'), getMaxTemperature);


router.route('/weather/:deviceName/max-precipitation').get(isAuthenticated, authorizeRoles('Admin', 'Teacher', 'Student'), getMaxPrecipitation);


router.route('/weather/:deviceName/:time').get(isAuthenticated, authorizeRoles('Admin', 'Teacher', 'Student'), getWeatherByStationAndDateTime);


router.route('/weather/temperature-humidity').get(isAuthenticated, authorizeRoles('Admin', 'Teacher', 'Student'), getWeatherByTemperatureAndHumidity);

// Routes with :id parameter

router.route('/weather/:id').get(isAuthenticated, authorizeRoles('Admin', 'Teacher', 'Student'), getWeatherById);


router.route('/weather/:id').delete(isAuthenticated, authorizeRoles('Admin', 'Teacher'), deleteWeatherData);

router.route('/weather/:id/precipitation').put(isAuthenticated, authorizeRoles('Admin', 'Teacher'), updatePrecipitation);

// Data insertion routes

router.route('/weather').post(insertWeatherData);

router.route('/weather/multiple').post(isAuthenticated, authorizeRoles('Admin', 'Sensor'), insertMultipleWeatherData);




export default router;