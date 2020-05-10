/* Empty JS object to act as endpoint for all routes */
projectData = {};

// API Credentials
const openWeatherApi = require('./api.json');

// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

// require fetch
const fetch = require("node-fetch");

/* Dependencies */
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
const { response } = require('express');
app.use(cors());

/* Initializing the main project folder */
app.use(express.static('website'));

const port = 8000;

// Spin up the server
const server = app.listen(port, serverListener);

function serverListener() {
    console.log(`Server is listening on port ${port}`);
}


/**
 * Route Endpoints
 */

app.get('/api/projectData', getProjectData);

app.post('/api/projectData', postProjectData);

/**
 * Endpoint callback functions
 */

function getProjectData (req, res) {
    console.log(projectData);
    res.send(projectData);
}

async function postProjectData (req, res) {
    const data = req.body;
    
    // return if there is no post data
    if (!data.zip || !data.userFeeling) {
        const error = "Invalid data: Zip and User Feeling are required!";
        console.log(error);
        res.send(error);
    }

    // post data otherwise
    try {
        const weatherData = await fetchWeatherInformation(data.zip);

        const tempInFahrenheit = (1.8 * (weatherData.main.temp - 273) + 32).toFixed(1); // 1.8(K - 273) + 32.

        projectData = {
            zipCode: data.zip,
            userFeeling: data.userFeeling,
            tempInFarenheit: tempInFahrenheit
        };
        
        console.log(projectData);
        res.send(projectData);
    }
    catch (error) {
        console.log(`Error while posting data: ${error}`);
    }
}


const fetchWeatherInformation = async (weatherQuery) => {

    try {
        const weatherApiResponse = await fetch(`${openWeatherApi.baseUrl}q=${weatherQuery}&appid=${openWeatherApi.apiKey}`);
        const data = await weatherApiResponse.json();
        return data;
    }
    catch (error) {
        console.log(`Error while fetching weather data: ${error}`)
    }

};
