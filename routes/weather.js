import express from 'express';
const router = express.Router();
import { getWeatherById, insertWeatherData, getMultipleWeatherData, insertMultipleWeatherData, updateWeatherData, deleteWeatherData, getTemperatureData, getHumidityRainfallData, getWeatherByStationAndDateTime, getMaxTemperature, updatePrecipitation, getMaxPrecipitation } from '../controllers/weatherController.js';


router.route('/weather/:id').get(getWeatherById);
router.route('/weather/multiple').get(getMultipleWeatherData);
router.route('/weather/station-datetime/:deviceName/:dateTime').get(getWeatherByStationAndDateTime);
router.route('/weather/max-temperature').get(getMaxTemperature);
router.route('/weather').post(insertWeatherData);
router.route('/weather/multiple').post(insertMultipleWeatherData);
router.route('/weather/:id').put(updateWeatherData);
router.route('/weather/:id/precipitation').put(updatePrecipitation);
router.route('/weather/:id').delete(deleteWeatherData);
router.route('/weather/temperature').get(getTemperatureData);
router.route('/weather/humidity-rainfall').get(getHumidityRainfallData);

router.route('/weather/:deviceName/max-precipitation').get(getMaxPrecipitation);



export default router;