import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
const startBtn = document.querySelector('[data-start]');
const daysElem = document.querySelector('[data-days]');
const hoursElem = document.querySelector('[data-hours]');
const minutesElem = document.querySelector('[data-minutes]');
const secondsElem = document.querySelector('[data-seconds]');
const datetimePicker = document.querySelector('#datetime-picker');
let userSelectedDate = null;
let timerId = null;
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
};
function updateTimer(days, hours, minutes, seconds) {
  daysElem.textContent = addLeadingZero(days);;
  hoursElem.textContent = addLeadingZero(hours);
  minutesElem.textContent = addLeadingZero(minutes);
  secondsElem.textContent = addLeadingZero(seconds);
};
startBtn.disabled = true;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];
    if (pickedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = pickedDate;
      startBtn.disabled = false;
    }
  },
};
flatpickr(datetimePicker, options);

startBtn.addEventListener('click', () => {
  if (!userSelectedDate)
    return;
  startBtn.disabled = true;
  datetimePicker.disabled = true;
  clearInterval(timerId);
  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;
    if (diff <= 0) {
      clearInterval(timerId);
      updateTimer(0, 0, 0, 0);
      iziToast.info({
        title: 'Done',
        message: 'Countdown finished!',
        position: 'topRight',
      });
      datetimePicker.disabled = false;
      startBtn.disabled = true;
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(diff);
    updateTimer(days, hours, minutes, seconds);
  }, 1000);
});
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
     return { days, hours, minutes, seconds };
};




   