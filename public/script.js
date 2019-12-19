const departureInput = document.getElementById("departure-input");
const arrivalInput = document.getElementById("arrival-input");
const dateTime = document.getElementById("date-time");
const searchInput = document.getElementById("search-input");
const dateInput = document.getElementById("date-input");
const timeInput = document.getElementById("time-input");
const submitButton = document.getElementById("submit-button");

let departureStopName = "";
let departureStopId = "";

let arrivalStopName = "";
let arrivalStopId = "";

// stackoverflow.com
serialize = function (obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

function getBusStopList(stopName, destination = true) {
    let params = {
        input: stopName,
        format: "json"
    };

    let queryString = serialize(params);
    console.log(queryString);

    axios.get(`http://localhost:5000/stop?${queryString}`)
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err));
}

departureInput.addEventListener("input", e => {
    e.preventDefault();
    if (departureInput.value.length > 2) {
        getBusStopList(departureInput.value, destination = true)
    }
});