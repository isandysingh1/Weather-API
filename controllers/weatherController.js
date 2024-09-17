import Weather from '../models/weatherModel.js';
import ErrorHandler from '../utils/errorHandler.js';


// Insert weather data => POST /api/weather
export const insertWeatherData = async (req, res, next) => {
    try {
        const { deviceName, precipitation, time, latitude, longitude, temperature, atmosphericPressure, maxWindSpeed, solarRadiation, vaporPressure, humidity, windDirection } = req.body;
        if (!deviceName || !precipitation || !time || !latitude || !longitude || !temperature || !atmosphericPressure || !maxWindSpeed || !solarRadiation || !vaporPressure || !humidity || !windDirection) {
            return next(new ErrorHandler('Missing fields Required', 400));
        }
        const weather = await Weather.create(req.body);
        res.status(200).json({ message: 'SingleWeather data inserted successfully', weather });
    } catch (error) {
        next(new ErrorHandler('Server error', 500));
    }
}

// Insert multiple weather data => POST /api/weather/multiple
export const insertMultipleWeatherData = async (req, res, next) => {
    try {
        const weather = await Weather.insertMany(req.body);
        res.status(200).json({ message: 'Multiple Weather data inserted successfully', weather });
    } catch (error) {
        next(new ErrorHandler('Server error', 500));
    }
}


// Get weather by id => GET /api/weather/:id
export const getWeatherById = async (req, res, next) => {
    try {
        const weather = await Weather.findById(req.params.id);
        if (!weather) {
            return next(new ErrorHandler('Weather data not found', 404));
        }
        res.status(200).json(weather);
    } catch (error) {
        next(new ErrorHandler('Server error', 500));
    }
};

// Get max precipitation for a device in the last 5 months => GET /api/weather/:deviceName/max-precipitation
export const getMaxPrecipitation = async (req, res, next) => {
    try {
        const { deviceName } = req.params;

        // Calculate the date 5 months ago
        const fiveMonthsAgo = new Date();
        fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

        // Perform the query to find the max precipitation in the last 5 months for the specified device
        const maxPrecipitationRecord = await Weather.findOne({
            'Device Name': deviceName,
            'Time': { $gte: fiveMonthsAgo }
        })
        .sort({ 'Precipitation mm/h': -1 })
        .select({
            'Device Name': 1,
            'Precipitation mm/h': 1,
            'Time': 1 
        })
        .lean();
        console.log(maxPrecipitationRecord);

        // If no data found, return a 404 error
        if (!maxPrecipitationRecord) {
            return next(new ErrorHandler('No data found for this device in the last 5 months', 404));
        }

        // Return the result
        res.status(200).json({
            success: true,
            data: maxPrecipitationRecord
        });
    } catch (error) {
        console.error("Error fetching max precipitation:", error);
        next(new ErrorHandler('Server error', 500));
    }
};

// Get Multiple Weather Data => GET /api/weather/multiple
export const getMultipleWeatherData = async (req, res, next) => {
    try {
        const weather = await Weather.find();
        res.status(200).json(weather);
    } catch (error) {
        next(new ErrorHandler('Server error', 500));
    }
};

// Find specific weather data by station and date/time => GET /api/weather/:deviceName/:dateTime
export const getWeatherByStationAndDateTime = async (req, res, next) => {
    try {
        const { deviceName, dateTime } = req.params;
        const weather = await Weather.findOne({ deviceName, time: new Date(dateTime) })
            .select('temperature atmosphericPressure solarRadiation precipitation')
            .exec();

        if (!weather) {
            return next(new ErrorHandler('No data found', 404));
        }
        res.status(200).json(weather);
    } catch (error) {
        next(new ErrorHandler('Server error', 500));
    }
}

// Find max temperature for all stations within a date range => GET /api/weather/max-temperature
export const getMaxTemperature = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const maxTemperature = await Weather.find({ time: { $gte: new Date(startDate), $lte: new Date(endDate) } })
            .sort({ 'temperature': -1 })
            .limit(1)
            .select('deviceName time temperature')
            .exec();

        if (!maxTemperature.length) {
            return next(new ErrorHandler('No data found', 404));
        }
        res.status(200).json(maxTemperature[0]);
    } catch (error) {
        next(new ErrorHandler('Server error', 500));
    }
};

// Update weather data => PUT /api/weather/:id
export const updateWeatherData = async (req, res, next) => {
    try {
        const weather = await Weather.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: 'Weather data updated successfully', weather });
    } catch (error) {
        next(new ErrorHandler('Server error', 500));
    }
};

// Update precipitation value => PUT /api/weather/:id/precipitation
export const updatePrecipitation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { precipitation } = req.body;
        const weather = await Weather.findByIdAndUpdate(id, { precipitation }, { new: true });
        res.status(200).json({ message: 'Precipitation updated successfully', weather });
    } catch (error) {
        next(new ErrorHandler('Server error', 500));
    }
};

// Delete weather data => DELETE /api/weather/:id
export const deleteWeatherData = async (req, res) => {
    try {
        const weather = await Weather.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Weather data deleted successfully', weather });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// Get Temperature data => GET /api/weather/temperature
export const getTemperatureData = async (req, res) => {
    try {
        const weather = await Weather.find();
        res.status(200).json(weather);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Humidity and Rainfall data => GET /api/weather/humidity-rainfall
export const getHumidityRainfallData = async (req, res) => {
    try {
        const weather = await Weather.find({}).sort({ 'Humidity (%)': 1, 'Precipitation mm/h': 1 });
        res.status(200).json(weather);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
