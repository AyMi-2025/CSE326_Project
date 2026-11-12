// register.js
// localStorage keys: "events" and "registrations"

var form = document.getElementById("registerForm");
var eventSelect = document.getElementById("eventSelect");
var seatInfo = document.getElementById("seatInfo");

var nameInput = document.getElementById("name");
var rollInput = document.getElementById("rollNo");
var emailInput = document.getElementById("email");
var phoneInput = document.getElementById("phone");

function getEvents() {
    return JSON.parse(localStorage.getItem("events")) || [];
}

function getRegistrations() {
    return JSON.parse(localStorage.getItem("registrations")) || [];
}

// fill the dropdown with events
function loadEvents() {
    var events = getEvents();
    var oldValue = eventSelect.value;

    eventSelect.innerHTML = '<option value="">-- choose event --</option>';

    for (var i = 0; i < events.length; i++) {
        var option = document.createElement("option");
        option.value = events[i].id;
        if (events[i].seats > 0) {
            option.textContent = events[i].title + " (" + events[i].seats + " seats left)";
        } else {
            option.textContent = events[i].title + " (Full)";
            option.disabled = true;
        }
        eventSelect.appendChild(option);
    }

    // if we came from the Register Now button, the id is in the url (register.html?event=2)
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get("event") || oldValue;
    if (wanted) {
        eventSelect.value = wanted;
    }
    showSeats();
}

function findEvent(id) {
    var events = getEvents();
    for (var i = 0; i < events.length; i++) {
        if (String(events[i].id) === String(id)) {
            return events[i];
        }
    }
    return null;
}

function showSeats() {
    var ev = findEvent(eventSelect.value);
    seatInfo.className = "";

    if (ev == null) {
        seatInfo.textContent = "";
    } else if (ev.seats > 0) {
        seatInfo.textContent = ev.date + ", " + ev.venue + " | Seats left: " + ev.seats;
    } else {
        seatInfo.textContent = "No seats left for this event";
        seatInfo.className = "full";
    }
}

function showError(errorId, inputEl, msg) {
    document.getElementById(errorId).textContent = msg;
    inputEl.parentNode.classList.add("invalid");
}

function clearErrors() {
    var errors = document.getElementsByClassName("error");
    for (var i = 0; i < errors.length; i++) {
        errors[i].textContent = "";
    }
    var fields = document.getElementsByClassName("field");
    for (var j = 0; j < fields.length; j++) {
        fields[j].classList.remove("invalid");
    }
}

// regular expressions
var nameRegex = /^[A-Za-z ]{3,40}$/;
var rollRegex = /^[A-Za-z0-9]{5,15}$/;
var emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
var phoneRegex = /^[6-9][0-9]{9}$/;

form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    var eventId = eventSelect.value;
    var name = nameInput.value.trim();
    var rollNo = rollInput.value.trim().toUpperCase();
    var email = emailInput.value.trim();
    var phone = phoneInput.value.trim();

    var ok = true;

    if (eventId === "") {
        showError("eventError", eventSelect, "Please select an event");
        ok = false;
    }
    if (!nameRegex.test(name)) {
        showError("nameError", nameInput, "Enter a valid name (only letters, min 3)");
        ok = false;
    }
    if (!rollRegex.test(rollNo)) {
        showError("rollError", rollInput, "Enter a valid roll number");
        ok = false;
    }
    if (!emailRegex.test(email)) {
        showError("emailError", emailInput, "Enter a valid email");
        ok = false;
    }
    if (!phoneRegex.test(phone)) {
        showError("phoneError", phoneInput, "Phone number must be 10 digits");
        ok = false;
    }

    if (!ok) {
        return;
    }

    // get the latest data from localStorage
    var events = getEvents();
    var selectedEvent = null;
    for (var i = 0; i < events.length; i++) {
        if (String(events[i].id) === String(eventId)) {
            selectedEvent = events[i];
        }
    }

    if (selectedEvent == null) {
        showError("eventError", eventSelect, "This event does not exist anymore");
        loadEvents();
        return;
    }

    if (selectedEvent.seats > 0) {
        var registrations = getRegistrations();

        // same student should not register twice for same event
        for (var k = 0; k < registrations.length; k++) {
            if (registrations[k].rollNo === rollNo && registrations[k].eventTitle === selectedEvent.title) {
                showError("rollError", rollInput, "This roll number is already registered for this event");
                return;
            }
        }

        registrations.push({
            name: name,
            rollNo: rollNo,
            email: email,
            phone: phone,
            eventTitle: selectedEvent.title
        });
        selectedEvent.seats = selectedEvent.seats - 1;

        localStorage.setItem("registrations", JSON.stringify(registrations));
        localStorage.setItem("events", JSON.stringify(events));

        showConfirmation(selectedEvent, name, rollNo, email, phone);
    } else {
        showError("eventError", eventSelect, "Sorry, no seats are left");
        loadEvents();
    }
});

function showConfirmation(ev, name, rollNo, email, phone) {
    document.getElementById("slipEvent").textContent = ev.title;
    document.getElementById("slipDate").textContent = ev.date;
    document.getElementById("slipVenue").textContent = ev.venue;
    document.getElementById("slipName").textContent = name;
    document.getElementById("slipRoll").textContent = rollNo;
    document.getElementById("slipEmail").textContent = email;
    document.getElementById("slipPhone").textContent = phone;

    document.getElementById("formSection").classList.add("hidden");
    document.getElementById("confirmation").classList.remove("hidden");
}

document.getElementById("registerAnother").addEventListener("click", function () {
    form.reset();
    clearErrors();
    document.getElementById("confirmation").classList.add("hidden");
    document.getElementById("formSection").classList.remove("hidden");
    loadEvents();
});

eventSelect.addEventListener("change", showSeats);

// only allow numbers in phone box
phoneInput.addEventListener("input", function () {
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "");
});

loadEvents();