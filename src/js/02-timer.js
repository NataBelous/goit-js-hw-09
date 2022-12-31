import { Notify } from 'notiflix/build/notiflix-notify-aio';
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const daysRef = document.querySelector('span[data-days]');
const hoursRef = document.querySelector('span[data-hours]');
const minsRef = document.querySelector('span[data-minutes]');
const secsRef = document.querySelector('span[data-seconds]');
const startBtn = document.querySelector('button[data-start]');

let timerId = null;
let targetDate = null;

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  timerId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = targetDate - currentTime;
    const time = convertMs(deltaTime);
    daysRef.textContent = time.days;
    hoursRef.textContent = time.hours;
    minsRef.textContent = time.minutes;
    secsRef.textContent = time.seconds;
  }, 1000);
});

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    targetDate = selectedDates[0];
    if (targetDate < Date.now()) {
      Notify.failure('Please choose a date in the future');
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
};
flatpickr("#datetime-picker", options);
