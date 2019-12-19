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

    axios.get(`http://localhost:5000/stop?${queryString}`)
        .then(res => {
            let stop = res.data.stop[0];
            if (destination === true) {
                arrivalStopName = stop.name;
                arrivalStopId = stop.id;
                arrivalInput.value = arrivalStopName;
            } else {
                departureStopName = stop.name;
                departureStopId = stop.id;
                departureInput.value = departureStopName;
            }
        })
        .catch(err => console.log(err));
}

departureInput.addEventListener("input", e => {
    e.preventDefault();
    if (departureInput.value.length > 2) {
        getBusStopList(departureInput.value, destination = false)
    }
});

arrivalInput.addEventListener("input", e => {
    e.preventDefault();
    if (arrivalInput.value.length > 2) {
        getBusStopList(arrivalInput.value, destination = true)
    }
});