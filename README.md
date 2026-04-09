# The Canopy Retreat – Smart Hotel Check-In System 🏨

> A modern, paperless hotel guest check-in web application built with vanilla HTML, CSS, and JavaScript.

---

## ✨ Features

- **📋 5-Step Check-In Flow** — Booking verification → Personal info → ID proof → Digital signature → Room selection
- **🛏️ Room Catalogue** — 8 room types with filter by category (Standard / Premium / Suite)
- **✍️ Canvas Signature** — Draw your signature with mouse or touch
- **🔒 Consent Management** — Multi-checkbox policy agreement system
- **📦 Session State** — All form data tracked and reviewed before submission
- **🎉 Animated Success Screen** — Confetti animation + booking confirmation card
- **📱 Fully Responsive** — Sidebar on desktop, mobile-friendly header on small screens
- **🚫 Zero Dependencies** — No frameworks, no npm, no build tools

---

## 🗂️ Project Structure

```
Hotel-Management-System/
├── index.html        # App shell & all screen templates
├── style.css         # Design system & component styles
├── app.js            # Application logic & state management
└── README.md
```

---

## 🚀 Getting Started

### Option 1 – Open directly (static only, no forms need a backend)

```bash
# Clone the repo
git clone https://github.com/Dev-Patel-WIZ27/Hotel-Management-System.git
cd Hotel-Management-System

# Open in browser
start index.html    # Windows
open index.html     # macOS
```

### Option 2 – Serve locally with Python

```bash
python -m http.server 8080
# Then open: http://localhost:8080
```

### Option 3 – Serve with VS Code Live Server

Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) → right-click `index.html` → **Open with Live Server**.

---

## 🧭 Check-In Flow

```
[Landing] → [Guest Profile] → [Personal Info] → [ID Verification]
         → [Digital Signature] → [Review] → [Room Selection] → [Confirmed ✓]
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#0ea5e9` (Teal) |
| Accent | `#6366f1` (Indigo) |
| Background | `#070c15` |
| Surface | `#0d1626` / `#111d33` |
| Font | Outfit (Google Fonts) |
| Radius | 8px / 14px / 20px / 28px |

---

## 📸 Screens

| Screen | Description |
|--------|-------------|
| 🏠 Landing | Booking reference + check-in date entry |
| 👤 Guest Profile | Booking summary card with status |
| 📋 Personal Info | Name, email, phone, DOB, nationality |
| 🪪 ID Verification | Document type, number, expiry, country |
| ✍️ Signature | Canvas-based digital signature with 3 consent checks |
| 🔍 Review | Full details summary before confirmation |
| 🛏️ Room Selection | Filterable room grid with prices |
| 🎉 Success | Animated confirmation with booking card |

---

## 🖋️ Author

**Dev Patel** — [@Dev-Patel-WIZ27](https://github.com/Dev-Patel-WIZ27)

---

## 📄 License

MIT License — free to use, modify, and distribute.
