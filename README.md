# Pomodoro — GNOME Shell Extension

**Pomodoro** is a lightweight extension for GNOME Shell that brings the *Pomodoro* technique to the top panel. It allows you to set up work sessions and breaks, display notifications, and keep a simple record of study time.

---

## Main features
- Pomodoro timer on the panel.
- Configurable sessions: work, short break, long break.
- Notifications at the start/end of sessions.
- Counter for time studied and sessions completed (persistent via GSettings).
- Integrated preferences to adjust durations.
- Lightweight and non-intrusive.

---

## Screenshots
*(Add images to the `screenshots/` folder and link them here)*
- `screenshots/panel.png` — indicator in the panel
- `screenshots/prefs.png` — preferences window

---

## Requirements
- GNOME Shell 48 (compatible with 48; check `metadata.json`).
- GJS (Gnome JavaScript bindings).
- `glib-compile-schemas` to compile the GSettings schema if you are going to package.

---

## Installation (developer / local testing)

1. Clone the repository:
```bash
git clone https://github.com/dalt-builds/Pomodoro.git
cd Pomodoro
