const express = require('express');
const app = express();
const https = require('https');
const cors = require('cors');
const bodyParser = require("body-parser");
const redis = require("redis");
const port = process.env.PORT || 3000;
var password = require('password-hash-and-salt');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('static'))
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { //sends root html file
    res.sendFile(path.join(__dirname + '/static/index.html'));
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`GET from ${ip} at /`);
});

app.get('/loggedIn', (req, res) => {
    es.sendFile(path.join(__dirname + '/static/index.html'));
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`GET from ${ip} at /loggedIn`);
})

app.post('/api/login', (req, res) => {
    console.log(req.body);
    redis.createClient(6379, "34.71.143.101").hget(req.body.username, "hash", (err, reply) => {
        if (err) {
            alert("Internal Server error");
            res.json({status: "Error"});
        } else if((reply === null)){
            res.json({status: "Invalid", errorMessage: "username does not exist, no reply fron redis"});
        } else {
            password(req.body.password).verifyAgainst(reply, function(error, verified) {
                if(!verified) {
                    res.json({status: "Invalid"})
                } else {
                    res.json({status: "Authenticated"});
                }
            });
        }
    })
});
app.post('/api/signUp', (req, res) => {
    const client = redis.createClient(6379, "34.71.143.101");
    console.log(req.body);
    // check if username exists, send error message, alert
    // if username does not exist, store username, password (create user)
    client.hget(req.body.username, "name", (err, reply) => {
        if (err) {
            alert("Internal Server error");
        } else if(!(reply === null)){
            // user exists already
            console.log("User already exists");
            res.json({status: "User Exists"});
        } else {
            // user does not exists
            client.hset(req.body.username, "name", req.body.name);
            password(req.body.password).hash(function(error, hash) {
                if(error)
                    throw new Error('Something went wrong!');
                client.hset(req.body.username, "hash", hash);
            });
            console.log("Created New User");
            res.json({status: "Success"});
        }
    });
});
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
app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port} ...`);   
})