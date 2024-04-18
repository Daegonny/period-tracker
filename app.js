const newPeriodFormEl = document.getElementsByTagName("form")[0];
const clearPastPeriodsEl = document.getElementById("clear")
const startDateInputEl = document.getElementById("start-date");
const endDateInputEl = document.getElementById("end-date");
const pastPeriodContainer = document.getElementById("past-periods");

const STORAGE_KEY = "period-tracker";

renderPastPeriods();

clearPastPeriodsEl.addEventListener("click", () => {
    clearPastPeriods();
    renderPastPeriods();
})

newPeriodFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const startDate = startDateInputEl.value;
    const endDate = endDateInputEl.value;

    if (checkDatesInvalid(startDate, endDate)) {
        newPeriodFormEl.reset();
        return;
    }

    storeNewPeriod(startDate, endDate);
    renderPastPeriods();
    newPeriodFormEl.reset();
});

function checkDatesInvalid(startDate, endDate) {
    return !startDate || !endDate || (startDate > endDate);
}

function clearPastPeriods() {
    window.localStorage.setItem(STORAGE_KEY, "");
    renderPastPeriods();
}

function storeNewPeriod(startDate, endDate) {
    const periods = getAllStoredPeriods();
    periods.push({ startDate, endDate });
    periods.sort((a, b) => {
        return new Date(b.startDate) - new Date(a.startDate);
    });

    string_periods = JSON.stringify(periods);
    window.localStorage.setItem(STORAGE_KEY, string_periods);
}

function getAllStoredPeriods() {
    const data = window.localStorage.getItem(STORAGE_KEY);
    const periods = data ? JSON.parse(data) : [];
    return periods;
}

function renderPastPeriods() {
    const periods = getAllStoredPeriods();
    pastPeriodContainer.innerHTML = "";

    if (periods.length === 0) {
        return;
    }

    const pastPeriodHeader = document.createElement("h2");
    pastPeriodHeader.textContent = "Past periods";
    const pastPeriodList = document.createElement("ul");

    periods.forEach((period) => {
        const periodEl = document.createElement("li");
        periodEl.textContent = `From ${formatDate(period.startDate)} to ${formatDate(period.endDate)}`;
        pastPeriodList.appendChild(periodEl);
    });

    pastPeriodContainer.appendChild(pastPeriodHeader);
    pastPeriodContainer.appendChild(pastPeriodList);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-br", { timeZone: "UTC" });
}