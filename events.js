// Default events for Campus Event Portal

let events = localStorage.getItem("events");

// Check if events are already saved
if (events == null) {

    // Creating four default events
    let eventList = [

        {
            id: 1,
            title: "Annual College Fest",
            category: "Fest",
            date: "2026-11-20",
            venue: "University Ground",
            eligibility: "All Students",
            seats: 100
        },

        {
            id: 2,
            title: "Web Development Workshop",
            category: "Workshop",
            date: "2026-11-25",
            venue: "Computer Lab",
            eligibility: "CSE Students",
            seats: 40
        },

        {
            id: 3,
            title: "Technology Seminar",
            category: "Seminar",
            date: "2026-12-02",
            venue: "Auditorium",
            eligibility: "All Students",
            seats: 80
        },

        {
            id: 4,
            title: "Coding Competition",
            category: "Competition",
            date: "2026-12-10",
            venue: "Block 32",
            eligibility: "All Students",
            seats: 50
        }

    ];

    // Saving events in localStorage
    localStorage.setItem("events", JSON.stringify(eventList));

    console.log("Default events added successfully.");

} else {

    console.log("Events are already saved.");

}