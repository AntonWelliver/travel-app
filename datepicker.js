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

/*
console.log(`date ${date}`);
console.log(`day ${day}`);
console.log(`month ${month}`);
console.log(`year ${year}`);
console.log(`weekday ${weekDays[dayOfWeek]}`);
*/

// The seelected date
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
      // Skottår ?
      if (year % 4 === 0) {
        // Året jämnt delbart med 4 => skottår
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
