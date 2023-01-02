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

function padStart(value) {
  return String(value).padStart(2, '0');
}

const daysRef = document.querySelector('span[data-days]');
const hoursRef = document.querySelector('span[data-hours]');
const minsRef = document.querySelector('span[data-minutes]');
const secsRef = document.querySelector('span[data-seconds]');
const startBtn = document.querySelector('button[data-start]');
const pickerRef = document.querySelector('#datetime-picker');

let timerId = null;
let targetDate = null;

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  pickerRef.disabled = true;
  timerId = setInterval(() => {
    const currentTime = Date.now();
    const deltaTime = targetDate - currentTime;
    if (deltaTime <= 0) {
      clearInterval(timerId);
      startBtn.disabled = false;
      pickerRef.disabled = false;
      Notify.success('🎉 Countdown is over! 🎉');
      return;
    }
    const time = convertMs(deltaTime);
    daysRef.textContent = padStart(time.days);
    hoursRef.textContent = padStart(time.hours);
    minsRef.textContent = padStart(time.minutes);
    secsRef.textContent = padStart(time.seconds);
  }, 1000);
});

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
