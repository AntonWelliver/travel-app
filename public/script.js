const departureInput = document.getElementById("departure-input");
const arrivalInput = document.getElementById("arrival-input");
const dateTime = document.getElementById("date-time");
const searchInput = document.getElementById("search-input");
const dateInput = document.getElementById("date-input");
const timeInput = document.getElementById("time-input");
const submitButton = document.getElementById("submit-button");
const departureDropdownChoices = document.getElementById("departure-dropdown-choices");
const arrivalDropdownChoices = document.getElementById("arrival-dropdown-choices");
const timeDateBox = document.getElementById("time-date-box");
const dateTimeToggle = document.getElementById("date-time-toggle");

let departureStopName = "";
let departureStopId = "";

let arrivalStopName = "";
let arrivalStopId = "";

let dateTimeVisible = false;

serialize = function (obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

function departureInputDropdown(stopList) {
    let output = "";

    stopList.forEach(stop => {
        output += `<a class="dropdown-item" href="#" data-id=${stop.id}>${stop.name}</a>`;
    });
    departureDropdownChoices.innerHTML = output;
    departureDropdownChoices.classList.add("show");
}

function clearDepartureDropdown() {
    let output = "";

    departureDropdownChoices.innerHTML = output;
    departureDropdownChoices.classList.remove("show");
}

function arrivalInputDropdown(stopList) {
    let output = "";

    stopList.forEach(stop => {
        output += `<a class="dropdown-item" href="#" data-id=${stop.id}>${stop.name}</a>`;
    });
    arrivalDropdownChoices.innerHTML = output;
    arrivalDropdownChoices.classList.add("show");
}

function clearArrivalDropdown() {
    let output = "";

    arrivalDropdownChoices.innerHTML = output;
    arrivalDropdownChoices.classList.remove("show");
}

function getBusStopList(stopName, destination = true) {
    let params = {
        input: stopName,
        format: "json"
    };

    let queryString = serialize(params);

    axios.get(`http://localhost:5000/stop?${queryString}`)
        .then(res => {
            let stopList = res.data.stop;
            if (destination === true) {
                arrivalInputDropdown(stopList);
            } else {
                departureInputDropdown(stopList);
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

departureDropdownChoices.addEventListener("click", e => {
    e.preventDefault();

    departureStopName = e.target.innerText;
    departureStopId = e.target.dataset.id;
    departureInput.value = `${departureStopName}`;
    clearDepartureDropdown();
});

arrivalInput.addEventListener("input", e => {
    e.preventDefault();
    if (arrivalInput.value.length > 2) {
        getBusStopList(arrivalInput.value, destination = true)
    }
});

arrivalDropdownChoices.addEventListener("click", e => {
    e.preventDefault();

    arrivalStopName = e.target.innerText;
    arrivalStopId = e.target.dataset.id;
    arrivalInput.value = `${arrivalStopName}`;
    clearArrivalDropdown();
});

departureInput.addEventListener("click", e => {
    e.preventDefault();
    clearDepartureDropdown();
});

arrivalInput.addEventListener("click", e => {
    e.preventDefault();
    clearArrivalDropdown();
});

dateTimeToggle.addEventListener("click", e => {
    e.preventDefault();
    if (dateTimeVisible === true) {
        dateTimeVisible = false;
        timeDateBox.classList.add("d-none");
    } else {
        dateTimeVisible = true;
        timeDateBox.classList.remove("d-none");
    }
});