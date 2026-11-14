# Campus Event Management & Registration Portal

A simple website for managing college fests, workshops, seminars and competitions.
Built for CSE326: Internet Programming using HTML5, CSS3 and vanilla JavaScript.

**Live website:** https://aymi-2025.github.io/CSE326_Project/

## Pages

| Page | File | What it does |
| --- | --- | --- |
| Events | `index.html`, `events.js` | Shows event cards with remaining seats and a category filter |
| Register | `register.html`, `register.js` | Student registration form with validation and a confirmation slip |
| Dashboard | `dashboard.html`, `dashboard.js` | Organizer adds/deletes events and views registered students |

## How the data is stored

There is no backend. Everything is saved in the browser's `localStorage` using two keys:

- `events` - array of `{ id, title, category, date, venue, eligibility, seats }`
- `registrations` - array of `{ name, rollNo, email, phone, eventTitle }`

Because of this, data stays only in the browser that was used for the demo.

## How to run

Open `index.html` in a browser (or use the Live Server extension in VS Code).

## Team

- Teammate 1 - Events page (`index.html`, `style.css`, `events.js`)
- Teammate 2 - Registration page (`register.html`, `register.css`, `register.js`)
- Teammate 3 - Organizer dashboard (`dashboard.html`, `dashboard.css`, `dashboard.js`, `README.md`)