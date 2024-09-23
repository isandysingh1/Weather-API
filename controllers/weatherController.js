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

// Find max temperature for all stations within a date range => GET /api/weather/max-temperature
export const getMaxTemperature = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        // Ensure the dates are valid
        if (!startDate || !endDate) {
            return next(new ErrorHandler('Invalid date range. Please provide both start and end dates.', 400));
        }

        // Convert string dates to Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Check if the start and end dates are valid dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return next(new ErrorHandler('Invalid date format. Please use YYYY-MM-DD format.', 400));
        }

        // Query to find the maximum temperature for all stations in the given date range
        const maxTemperatureRecord = await Weather.find({
            time: { $gte: start, $lte: end }  // Filter by the time range
        })
        .sort({ temperature: -1 })  // Sort by temperature in descending order
        .limit(1)  // Limit to one result (the highest temperature)
        .select('deviceName time temperature')  // Select only deviceName, time, and temperature fields
        .lean();  // Return a plain JavaScript object

        // If no data found, return a 404 error
        if (!maxTemperatureRecord || maxTemperatureRecord.length === 0) {
            return next(new ErrorHandler('No temperature data found for the given date range.', 404));
        }
        // Return the maximum temperature record
        res.status(200).json({
            success: true,
            data: maxTemperatureRecord
        });
    } catch (error) {
        console.error('Error in getMaxTemperature:', error);
        next(new ErrorHandler('Server error', 500));
    }
};

// Find specific weather data by station and date/time => GET /api/weather/:deviceName/:time
export const getWeatherByStationAndDateTime = async (req, res, next) => {
    try {
        const { deviceName, time } = req.params;

        // Trim the time parameter to remove any newline or extra whitespace
        const trimmedTime = time.trim();

        // Ensure the trimmed time is a valid date
        const queryDate = new Date(trimmedTime);
        if (isNaN(queryDate.getTime())) {
            return next(new ErrorHandler('Invalid date format. Please use YYYY-MM-DDTHH:mm:ss format.', 400));
        }

        // Query the database for the weather data based on deviceName and time
        const weather = await Weather.findOne({
            'Device Name': deviceName,
            'Time': queryDate
        })
        .select({
            'Device Name': 1,
            'Temperature (C)': 1,
            'Atmospheric Pressure (kPa)': 1,
            'Solar Radiation (W/m2)': 1,
            'Precipitation (mm/h)': 1,
            'Vapor Pressure (kPa)': 1,
            'Humidity (%)': 1,
            'Max Wind Speed (m/s)': 1,
            'Wind Direction (°)': 1,
            'Time': 1 
        })
        .lean();

        // If no data found, return a 404 error
        if (!weather) {
            return next(new ErrorHandler('No data found', 404));
        }

        // Return the weather data
        res.status(200).json({
            success: true,
            data: weather
        });
    } catch (error) {
        console.error('Error fetching weather data by station and date/time:', error);
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