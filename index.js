require("dotenv").config();

const express = require('express')
const app = express()
const port = 5000
const axios = require("axios")

const secretKey = process.env.secretKey;
let accessToken = "";
let accessTokenIsValid = false;
const revalidationTime = 3000 * 1000; //50min
/* const revalidationTime = 60 * 1000; //1min */

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

getNewAccessToken();

app.use((req, res, next) => {
    if (accessTokenIsValid === false) {
        getNewAccessToken();
        accessTokenIsValid = true
    }
    next()
});

app.get("/stop", (req, res) => {
    let headerConfig = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    let requestBody = {
        input: req.query.input,
        format: "json"
    };

    let queryString = serialize(requestBody);

    axios
        .get(`https://api.vasttrafik.se/bin/rest.exe/v2/location.name?${queryString}`, headerConfig)
        .then(result => {
            let matchingStopList = [];
            if (result.data.LocationList.StopLocation[0] != null) {
                matchingStopList = result.data.LocationList.StopLocation.map(
                    item => {
                        return { name: item.name, id: item.id };
                    }
                );
            } else {
                matchingStopList = [
                    {
                        name: result.data.LocationList.StopLocation.name,
                        id: result.data.LocationList.StopLocation.id
                    }
                ];
            }

            let stop = matchingStopList.slice(0, 3);
            res.json({ stop: stop });
        })
        .catch(err => console.log(err));
});

app.get("/trip", (req, res) => {
    let headerConfig = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    let requestBody = {
        originId: req.query.originId,
        destId: req.query.destId,
        date: req.query.date,
        time: req.query.time,
        searchForArrival: req.query.searchForArrival,
        numTrips: 1,
        format: "json"
    };

    let queryString = serialize(requestBody);

    axios
        .get(`https://api.vasttrafik.se/bin/rest.exe/v2/trip?${queryString}`, headerConfig)
        .then(result => {
            let tripData = result.data.TripList.Trip;
            let tripInfo = [];
            console.log(result.status);

            if (tripData.Leg[0] != null) {
                tripData.Leg.forEach(tripLeg => {
                    let journeyDetailRef = "";
                    if (tripLeg.JourneyDetailRef != null) {
                        journeyDetailRef = tripLeg.JourneyDetailRef.ref;
                    }

                    let legInfo = {
                        tripName: tripLeg.name,
                        tripType: tripLeg.type,
                        originName: tripLeg.Origin.name,
                        originTrack: tripLeg.Origin.track,
                        originTime: tripLeg.Origin.time,
                        originDate: tripLeg.Origin.date,
                        originRouteIdx: tripLeg.Origin.routeIdx,
                        destinationName: tripLeg.Destination.name,
                        destinationTrack: tripLeg.Destination.track,
                        destinationTime: tripLeg.Destination.time,
                        destinationDate: tripLeg.Destination.date,
                        destinationRouteIdx: tripLeg.Destination.routeIdx,
                        journeyDetailRef: journeyDetailRef
                    };
                    tripInfo.push(legInfo);
                });
            } else {
                let tripLeg = tripData.Leg;

                let journeyDetailRef = "";
                if (tripLeg.JourneyDetailRef != null) {
                    journeyDetailRef = tripLeg.JourneyDetailRef.ref;
                }

                let legInfo = {
                    tripName: tripLeg.name,
                    tripType: tripLeg.type,
                    originName: tripLeg.Origin.name,
                    originTrack: tripLeg.Origin.track,
                    originTime: tripLeg.Origin.time,
                    originDate: tripLeg.Origin.date,
                    originRouteIdx: tripLeg.Origin.routeIdx,
                    destinationName: tripLeg.Destination.name,
                    destinationTrack: tripLeg.Destination.track,
                    destinationTime: tripLeg.Destination.time,
                    destinationDate: tripLeg.Destination.date,
                    destinationRouteIdx: tripLeg.Destination.routeIdx,
                    journeyDetailRef: journeyDetailRef
                };
                tripInfo.push(legInfo);
            }

            res.json({ tripInfo: tripInfo });
        })
        .catch(err => console.log(err));
});

app.listen(port, () => console.log(`Server started on port ${port}!`))