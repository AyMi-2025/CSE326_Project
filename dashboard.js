// dashboard.js - organizer dashboard
// localStorage keys: "events" and "registrations"

var eventForm = document.getElementById("eventForm");
var formMessage = document.getElementById("eventFormMessage");
var eventsBody = document.getElementById("eventsTableBody");
var registrationsBody = document.getElementById("registrationsTableBody");

function getEvents() {
    return JSON.parse(localStorage.getItem("events")) || [];
}

function getRegistrations() {
    return JSON.parse(localStorage.getItem("registrations")) || [];
}

function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// events table
function showEvents() {
    var events = getEvents();
    var html = "";

    if (events.length === 0) {
        eventsBody.innerHTML = '<tr><td colspan="7" class="table-empty">No events added yet.</td></tr>';
        return;
    }

    for (var i = 0; i < events.length; i++) {
        var ev = events[i];

        html += "<tr>";
        html += "<td>" + escapeHtml(ev.title) + "</td>";
        html += "<td>" + escapeHtml(ev.category) + "</td>";
        html += "<td>" + escapeHtml(ev.date) + "</td>";
        html += "<td>" + escapeHtml(ev.venue) + "</td>";
        html += "<td>" + escapeHtml(ev.eligibility) + "</td>";
        html += "<td>" + (ev.seats > 0 ? ev.seats : "Full") + "</td>";
        html += '<td><button type="button" class="delete-button" data-id="' + escapeHtml(String(ev.id)) + '">Delete</button></td>';
        html += "</tr>";
    }

    eventsBody.innerHTML = html;
}

// registered students table
function showRegistrations() {
    var list = getRegistrations();
    var html = "";

    if (list.length === 0) {
        registrationsBody.innerHTML = '<tr><td colspan="5" class="table-empty">No students have registered yet.</td></tr>';
        return;
    }

    for (var i = 0; i < list.length; i++) {
        html += "<tr>";
        html += "<td>" + escapeHtml(list[i].name) + "</td>";
        html += "<td>" + escapeHtml(list[i].rollNo) + "</td>";
        html += "<td>" + escapeHtml(list[i].email) + "</td>";
        html += "<td>" + escapeHtml(list[i].phone) + "</td>";
        html += "<td>" + escapeHtml(list[i].eventTitle) + "</td>";
        html += "</tr>";
    }

    registrationsBody.innerHTML = html;
}

function showMessage(text, isError) {
    formMessage.textContent = text;
    formMessage.style.color = isError ? "#b3261e" : "#2b4a3a";
}

// add a new event
eventForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var title = document.getElementById("eventTitle").value.trim();
    var category = document.getElementById("eventCategory").value;
    var date = document.getElementById("eventDate").value;
    var venue = document.getElementById("eventVenue").value.trim();
    var eligibility = document.getElementById("eventEligibility").value.trim();
    var seats = parseInt(document.getElementById("eventMaxSeats").value, 10);

    if (title === "" || category === "" || date === "" || venue === "" || eligibility === "") {
        showMessage("Please fill all the fields.", true);
        return;
    }
    if (isNaN(seats) || seats < 1) {
        showMessage("Seats must be at least 1.", true);
        return;
    }

    var events = getEvents();

    // registrations are saved with the event title, so titles should be different
    for (var i = 0; i < events.length; i++) {
        if (events[i].title.toLowerCase() === title.toLowerCase()) {
            showMessage("An event with this title already exists.", true);
            return;
        }
    }

    events.push({
        id: Date.now(),
        title: title,
        category: category,
        date: date,
        venue: venue,
        eligibility: eligibility,
        seats: seats
    });

    localStorage.setItem("events", JSON.stringify(events));

    eventForm.reset();
    showMessage("Event added successfully.", false);
    showEvents();
});

// delete an event (click on any Delete button in the table)
eventsBody.addEventListener("click", function (e) {
    if (!e.target.classList.contains("delete-button")) {
        return;
    }

    var id = e.target.getAttribute("data-id");

    if (!confirm("Are you sure you want to delete this event?")) {
        return;
    }

    var events = getEvents();
    var remaining = [];

    for (var i = 0; i < events.length; i++) {
        if (String(events[i].id) !== id) {
            remaining.push(events[i]);
        }
    }

    localStorage.setItem("events", JSON.stringify(remaining));
    showMessage("Event deleted.", false);
    showEvents();
});

showEvents();
showRegistrations();