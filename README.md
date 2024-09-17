# Weather-API

## Description
Weather-API is a Node.js application that provides weather data through a RESTful API. It uses Express.js for the server, Mongoose for MongoDB interactions, and dotenv for environment variable management.

## Features
- Insert single or multiple weather data entries
- Retrieve weather data by various criteria
- Update and delete weather data
- Error handling middleware

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/isandysingh1/Weather-API.git
    cd Weather-API/Backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `config.env` file in the `config` directory and add your environment variables:
    ```plaintext
    PORT=4000
    MONGO_URI=mongodb://localhost:27017/Weather_db
    ```

4. Start the server:
    ```bash
    npm run dev
    ```

## API Endpoints
### Weather Routes
- `POST /api/weather`: Insert single weather data
- `POST /api/weather/multiple`: Insert multiple weather data
- `GET /api/weather/:id`: Get weather data by ID
- `GET /api/weather/multiple`: Get multiple weather data
- `GET /api/weather/station-datetime/:deviceName/:dateTime`: Get weather data by station and date/time
- `GET /api/weather/max-temperature`: Get max temperature within a date range
- `PUT /api/weather/:id`: Update weather data by ID
- `PUT /api/weather/:id/precipitation`: Update precipitation value by ID
- `DELETE /api/weather/:id`: Delete weather data by ID
- `GET /api/weather/temperature`: Get temperature data
- `GET /api/weather/humidity-rainfall`: Get humidity and rainfall data
- `GET /api/weather/:deviceName/max-precipitation`: Get max precipitation for a device in the last 5 months
