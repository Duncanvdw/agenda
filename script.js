const monthYearElement = document.getElementById('month-year');
const datesElement = document.getElementById('data');
const prevBtn = document.getElementById('prev-button'); // Changed to getElementById
const nextBtn = document.getElementById('next-button'); // Changed to getElementById

let currentDate = new Date();
let unavailableDates = []; // Array to store unavailable dates

const updateCalander = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = (firstDay.getDay() + 6) % 7; // Adjust to start week on Monday
    const lastDayIndex = (lastDay.getDay() + 6) % 7;

    const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    monthYearElement.textContent = monthYearString;

    let datesHTML = '';

    // Render previous month's dates
    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = new Date(currentYear, currentMonth, -i + 1);
        const isUnavailable = unavailableDates.includes(prevDate.toISOString().split('T')[0]);
        datesHTML += `<div class="date inactive ${isUnavailable ? 'unavailable' : ''}" data-date="${prevDate.toISOString()}">${prevDate.getDate()}</div>`;
    }

    // Render current month's dates
    for (let i = 1; i <= totalDays; i++) {
        const currentDateISO = new Date(currentYear, currentMonth, i).toISOString();
        const isToday = currentDate.getDate() === i && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;
        const isUnavailable = unavailableDates.includes(currentDateISO.split('T')[0]);
        datesHTML += `<div class="date ${isToday ? 'active' : ''} ${isUnavailable ? 'unavailable' : ''}" data-date="${currentDateISO}">${i}</div>`;
    }

    // Render next month's dates
    for (let i = 1; i <= 6 - lastDayIndex; i++) {
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        const isUnavailable = unavailableDates.includes(nextDate.toISOString().split('T')[0]);
        datesHTML += `<div class="date inactive ${isUnavailable ? 'unavailable' : ''}" data-date="${nextDate.toISOString()}">${nextDate.getDate()}</div>`;
    }

    datesElement.innerHTML = datesHTML;

    // Add click event listeners to all dates
    const dateElements = document.querySelectorAll('.date');
    dateElements.forEach(dateElement => {
        dateElement.addEventListener('click', (event) => {
            if (event.target.classList.contains('unavailable')) return; // Skip unavailable dates

            // Remove 'selected' class from all dates
            dateElements.forEach(el => el.classList.remove('selected'));

            // Add 'selected' class to the clicked date
            event.target.classList.add('selected');

            // Update the selected date field
            const selectedDate = event.target.getAttribute('data-date');
            const selectedDateField = document.querySelector('.selected-date-field');
            selectedDateField.textContent = `Selected Date: ${new Date(selectedDate).toDateString()}`;
        });
    });
};

// Add event listener to the "Reserveer!" button
const reserveButton = document.querySelector('.button');
reserveButton.addEventListener('click', () => {
    const selectedDateElement = document.querySelector('.date.selected');
    if (!selectedDateElement) {
        alert('Please select a date before reserving!');
        return;
    }

    const selectedDate = selectedDateElement.getAttribute('data-date').split('T')[0];
    if (!unavailableDates.includes(selectedDate)) {
        unavailableDates.push(selectedDate); // Add the selected date to the unavailable dates list
        alert(`Date ${new Date(selectedDate).toDateString()} has been reserved!`);
        updateCalander(); // Re-render the calendar to reflect the unavailable date
    } else {
        alert('This date is already unavailable!');
    }
});

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalander();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalander();
});

updateCalander();