const express = require('express');
const app = express();
const https = require('https');
const cors = require('cors');
const bodyParser = require("body-parser");

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cors());
app.use(express.static('static'))

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port} ...`)
})

app.post('/api/login', (req, res) => {
    console.log(req.body);
    res.send("Visited /api/login")
});

app.post('/api/signUp', (req, res) => {
    console.log(req.body);
    res.send("Visited /api/signUp");
})

app.get('/', (req, res) => { //sends root html file
    res.sendFile(path.join(__dirname + '/static/index.html'));
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`GET from ${ip} at /`);
})

app.get('/api/getCurr', (req, response) => {        // Obtains currency exchange rates by calling API
    https.get('https://api.exchangerate-api.com/v6/latest', (res) => {
        const {
            statusCode
        } = res;
        const contentType = res.headers['content-type'];
        var error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            return;
        }
        res.setEncoding('utf8');
        var rawData = '';
        res.on('data', (chunk) => {
            rawData += chunk;
        });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                response.status(200).send(parsedData.rates);
                console.log(`GET from ${ip} at /getCurr; rates sent successfully`);
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
})