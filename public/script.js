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
const departureAndArrivalButtons = document.getElementById("departure-and-arrival-buttons");
const departureButton = document.getElementById("departure-button");
const arrivalButton = document.getElementById("arrival-button");
const choiceButton = document.getElementById("choice-button");

let departureStopName = "";
let departureStopId = "";

let arrivalStopName = "";
let arrivalStopId = "";

let dateTimeVisible = false;

let useArrivalTime = false;

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
        submitButton.classList.remove("d-none");
    } else {
        dateTimeVisible = true;
        timeDateBox.classList.remove("d-none");
        submitButton.classList.add("d-none");
    }
});

departureAndArrivalButtons.addEventListener("click", e => {
    e.preventDefault();
    if (e.target.id === "departure-button") {
        departureButton.classList.add("active");
        arrivalButton.classList.remove("active");
        useArrivalTime = false;
    }

    if (e.target.id === "arrival-button") {
        arrivalButton.classList.add("active");
        departureButton.classList.remove("active");
        useArrivalTime = true;
    }
});

choiceButton.addEventListener("click", e => {
    e.preventDefault();
    timeDateBox.classList.add("d-none");
    submitButton.classList.remove("d-none");
});

const datePickerElement = document.querySelector(".date-picker");
const selectedDateElement = document.querySelector(
    ".date-picker .selected-date"
);
const datesElement = document.querySelector(".date-picker .dates");
const mthElement = document.querySelector(".date-picker .dates .month .mth");
const nextMthElement = document.querySelector(
    ".date-picker .dates .month .next-mth"
);
const prevMthElement = document.querySelector(
    ".date-picker .dates .month .prev-mth"
);
const daysElement = document.querySelector(".date-picker .dates .days");

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();
let dayOfWeek = date.getDay();

// The selected date
let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

//mthElement.textContent = months[month] + " " + year;
mthElement.textContent = `${months[month]} ${year}`;

selectedDateElement.textContent = formatDate(date);
selectedDateElement.dataset.value = selectedDate;

populateDays();

datePickerElement.addEventListener("click", e => {
    if (checkEventPathForClass(e.path, "dates") != true) {
        datesElement.classList.toggle("active");
    }
});

nextMthElement.addEventListener("click", e => {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }

    mthElement.textContent = months[month] + " " + year;
    populateDays();
});

prevMthElement.addEventListener("click", e => {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }

    mthElement.textContent = months[month] + " " + year;
    populateDays();
});

function populateDays(e) {
    daysElement.innerHTML = "";

    let amountDays = 31;

    switch (month) {
        case 0: //Jan - 31
            amountDays = 31;
            break;
        case 1: //Feb - 28
            if (year % 4 === 0) {
                amountDays = 29;
            } else {
                amountDays = 28;
            }
            break;
        case 2: //Mar - 31
            amountDays = 31;
            break;
        case 3: //Apr - 31
            amountDays = 30;
            break;
        case 4: //May - 31
            amountDays = 31;
            break;
        case 5: //Jun - 31
            amountDays = 30;
            break;
        case 6: //Jul - 31
            amountDays = 31;
            break;
        case 7: //Aug - 31
            amountDays = 31;
            break;
        case 8: //Sep- 31
            amountDays = 31;
            break;
        case 9: //Oct - 31
            amountDays = 31;
            break;
        case 10: //Nov- 31
            amountDays = 31;
            break;
        case 11: //Dec - 31
            amountDays = 31;
            break;

        default:
            amountDays = 31;
    }

    for (let i = 0; i < amountDays; i++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("day");
        dayElement.textContent = i + 1;

        if (
            selectedDay == i + 1 &&
            selectedYear == year &&
            selectedMonth == month
        ) {
            dayElement.classList.add("selected");
        }

        // Select day from calendar
        dayElement.addEventListener("click", e => {
            selectedDate = new Date(year + "-" + (month + 1) + "-" + (i + 1));
            selectedDay = i + 1;
            selectedMonth = month;
            selectedYear = year;
            selectedDateElement.textContent = formatDate(selectedDate);
            selectedDateElement.dataset.value = selectedDate;

            populateDays();
        });

        daysElement.appendChild(dayElement);
    }
}

function checkEventPathForClass(path, selector) {
    for (let i = 0; i < path.length; i++) {
        if (path[i].classList && path[i].classList.contains(selector)) {
            return true;
        }
    }
    return false;
}

function formatDate(d) {
    let day = d.getDate();
    if (day < 10) {
        day = "0" + day;
    }

    let month = d.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let year = d.getFullYear();

    return day + " / " + month + " / " + year;
}

const timePickerElement = document.querySelector(".time-picker");

const hrElement = document.querySelector(".time-picker .hour .hr");
const minElement = document.querySelector(".time-picker .minute .min");

const hrUp = document.querySelector(".time-picker .hour .hr-up");
const hrDown = document.querySelector(".time-picker .hour .hr-down");

const minUp = document.querySelector(".time-picker .minute .min-up");
const minDown = document.querySelector(".time-picker .minute .min-down");

let d = new Date();

// The selected time
let hour = d.getHours();
let minute = d.getMinutes();
setTime();

// hour up cursor
hrUp.addEventListener("click", () => {
    hour++;
    if (hour > 23) {
        hour = 0;
    }
    setTime();
});

hrDown.addEventListener("click", () => {
    hour--;
    if (hour < 0) {
        hour = 23;
    }
    setTime();
});

minDown.addEventListener("click", () => {
    minute--;
    if (minute < 0) {
        minute = 59;
        if (hour > 0) {
            hour--;
        }
    }
    setTime();
});

minUp.addEventListener("click", () => {
    minute++;
    if (minute > 59) {
        minute = 0;
        hour++;
    }
    setTime();
});

hrElement.addEventListener("change", e => {
    if (e.target.value > 23) {
        e.target.value = 23;
    } else if (e.target.value < 0) {
        e.target.value = "00";
    }

    if (e.target.value == "") {
        e.target.value = formatTime(hour);
    }

    hour = e.target.value;
});

minElement.addEventListener("change", e => {
    if (e.target.value > 59) {
        e.target.value = 59;
    } else if (e.target.value < 0) {
        e.target.value = "00";
    }

    if (e.target.value == "") {
        e.target.value = formatTime(minute);
    }

    minute = e.target.value;
});

function setTime() {
    hrElement.value = formatTime(hour);
    minElement.value = formatTime(minute);
    timePickerElement.dataset.time = formatTime(hour) + ":" + formatTime(minute);
}

function formatTime(time) {
    if (time < 10) {
        time = "0" + time;
    }
    return time;
}
