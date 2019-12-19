require("dotenv").config();

const express = require('express')
const app = express()
const port = 5000
const axios = require("axios")

const secretKey = process.env.secretKey;
let accessToken = "";
let accessTokenIsValid = false;
/* const revalidationTime = 3000 * 1000; //50min */
const revalidationTime = 300 * 1000; //1min

serialize = function (obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

function updateAccessToken(newToken) {
    accessToken = newToken;
    accessTokenIsValid = true;

    setTimeout(() => {
        tokenIsInvalid();
    }, revalidationTime);
}

function isTokenValid() {
    return accessTokenIsValid;
}

function tokenIsInvalid() {
    accessTokenIsValid = false;
}

function getNewAccessToken() {
    let headerConfig = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${secretKey}`
        }
    };

    let requestBody = {
        grant_type: "client_credentials",
        scope: "dev_123"
    };

    let queryString = serialize(requestBody);
    axios
        .post("https://api.vasttrafik.se/token", queryString, headerConfig)
        .then(res => {
            updateAccessToken(res.data.access_token);
        })
        .catch(err => console.log(err));
}

app.use(express.static('public'))

app.use(express.json({ extended: false }));

app.use((req, res, next) => {
    if (accessTokenIsValid === false) {
        getNewAccessToken();
        accessTokenIsValid = true
    }
    next()
});

app.get("/stop", (req, res) => {
    console.log(req.query.input);
    res.json({ resultMessage: "It works" });
});

app.listen(port, () => console.log(`Server started on port ${port}!`))