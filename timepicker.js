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

// fixa blank
function formatTime(time) {
  if (time < 10) {
    time = "0" + time;
  }
  return time;
}
