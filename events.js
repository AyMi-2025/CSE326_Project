// events.js - homepage (index.html)
// localStorage keys: "events" and "registrations"

var eventList = document.getElementById("eventList");
var categoryFilter = document.getElementById("categoryFilter");

// 4 default events, saved only the first time (when nothing is stored yet)
var defaultEvents = [
    {
        id: 1,
        title: "Tech Fest 2026",
        category: "Fest",
        date: "2026-12-05",
        venue: "Main Auditorium",
        eligibility: "All students",
        seats: 100
    },
    {
        id: 2,
        title: "Web Development Workshop",
        category: "Workshop",
        date: "2026-12-10",
        venue: "Computer Lab 2",
        eligibility: "CSE and IT students",
        seats: 40
    },
    {
        id: 3,
        title: "Career Guidance Seminar",
        category: "Seminar",
        date: "2026-12-15",
        venue: "Seminar Hall",
        eligibility: "Final year students",
        seats: 80
    },
    {
        id: 4,
        title: "Inter-College Coding Contest",
        category: "Competition",
        date: "2026-12-20",
        venue: "Block B, Room 101",
        eligibility: "All students",
        seats: 60
    }
];

function getEvents() {
    return JSON.parse(localStorage.getItem("events")) || [];
}

if (localStorage.getItem("events") === null) {
    localStorage.setItem("events", JSON.stringify(defaultEvents));
}

// stops a title like <b>hello</b> from being treated as html
function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function showEvents() {
    var events = getEvents();
    var selected = categoryFilter.value;
    var html = "";
    var count = 0;

    for (var i = 0; i < events.length; i++) {
        var ev = events[i];

        if (selected !== "all" && ev.category !== selected) {
            continue;
        }
        count++;

        html += '<div class="event-card">';
        html += '<span class="event-category">' + escapeHtml(ev.category) + '</span>';
        html += '<h3>' + escapeHtml(ev.title) + '</h3>';
        html += '<p>Date: ' + escapeHtml(ev.date) + '</p>';
        html += '<p>Venue: ' + escapeHtml(ev.venue) + '</p>';
        html += '<p>Eligibility: ' + escapeHtml(ev.eligibility) + '</p>';

        if (ev.seats > 0) {
            html += '<p class="event-seats">Seats left: ' + ev.seats + '</p>';
            html += '<a href="register.html?event=' + encodeURIComponent(ev.id) + '" class="primary-button">Register Now</a>';
        } else {
            html += '<p class="event-seats">Seats full</p>';
        }

        html += '</div>';
    }

    if (count === 0) {
        html = '<p class="empty-state">No events found in this category.</p>';
    }

    eventList.innerHTML = html;
}

categoryFilter.addEventListener("change", showEvents);

// when user comes back with the back button, show the latest seat count
window.addEventListener("pageshow", showEvents);

showEvents();