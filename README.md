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
- `<img width="48" height="29" alt="image" src="https://github.com/user-attachments/assets/652e0686-80a9-4760-ab4e-6b5816bd4242" />
` — indicator in the panel
- `<img width="304" height="218" alt="image" src="https://github.com/user-attachments/assets/e93b6fb1-9127-42f2-aaa4-6aa6c954bbd1" />
` — preferences window

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
