// extension.js — GNOME 48
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import St from 'gi://St';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export default class PomodoroExtension extends Extension {
    enable() {
        // Settings from the schema defined in metadata.json
        this._settings = this.getSettings();

        // State
        this._state = 'idle';          // 'idle' | 'work' | 'break' | 'paused'
        this._remaining = 0;           // seconds
        this._cycles = 0;              // pomodoros completed in the block
        this._timerId = 0;

        // Indicator on the panel
        this._indicator = new PanelMenu.Button(0.0, this.metadata.name, false);
        this._label = new St.Label({ text: 'Pomodoro' });
        this._indicator.add_child(this._label);

        // Menu
        this._miStart = new PopupMenu.PopupMenuItem('Start');
        this._miPause = new PopupMenu.PopupMenuItem('Pause/Continue');
        this._miReset = new PopupMenu.PopupMenuItem('Restart');
        this._miStats = new PopupMenu.PopupMenuItem('—');

        this._indicator.menu.addMenuItem(this._miStart);
        this._indicator.menu.addMenuItem(this._miPause);
        this._indicator.menu.addMenuItem(this._miReset);
        this._indicator.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this._indicator.menu.addMenuItem(this._miStats);

        this._miStart.connect('activate', () => this._startWork());
        this._miPause.connect('activate', () => this._togglePause());
        this._miReset.connect('activate', () => this._resetStats());

        Main.panel.addToStatusArea(this.uuid, this._indicator);

        // Loop 1s
        this._startTicker();
        this._refresh();
    }

    disable() {
        if (this._timerId) {
            GLib.Source.remove(this._timerId);
            this._timerId = 0;
        }
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
        this._settings = null;
    }

    // --- Logic ---
    _startWork() {
        this._state = 'work';
        this._remaining = this._settings.get_int('work-duration') * 60;
        this._refresh();
    }

    _startBreak() {
        this._state = 'break';
        const beforeLong = this._settings.get_int('cycles-before-long');
        const mins = (this._cycles % beforeLong === 0 && this._cycles !== 0)
            ? this._settings.get_int('long-break')
            : this._settings.get_int('short-break');
        this._remaining = mins * 60;
        this._refresh();
    }

    _togglePause() {
        if (this._state === 'paused') this._state = this._prevState ?? 'idle';
        else { this._prevState = this._state; this._state = 'paused'; }
        this._refresh();
    }

    _resetStats() {
        this._settings.set_uint('pomodoro-seconds', 0);
        this._settings.set_uint('sessions-completed', 0);
        this._cycles = 0;
        this._state = 'idle';
        this._remaining = 0;
        this._refresh();
    }

    _startTicker() {
        if (this._timerId) GLib.Source.remove(this._timerId);
        this._timerId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
            if (this._state === 'work') {
                if (this._remaining > 0) {
                    this._remaining--;
                    const total = this._settings.get_uint('pomodoro-seconds') + 1;
                    this._settings.set_uint('pomodoro-seconds', total);
                } else {
                    this._settings.set_uint('sessions-completed',
                        this._settings.get_uint('sessions-completed') + 1);
                    this._cycles++;
                    this._startBreak();
                }
            } else if (this._state === 'break') {
                if (this._remaining > 0) this._remaining--;
                else this._startWork();
            }
            this._refresh();
            return GLib.SOURCE_CONTINUE;
        });
    }

    _fmt(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    _refresh() {
        // Label
        let text = '🍅';
        if (this._state === 'work') text = `🧠 ${this._fmt(this._remaining)}`;
        else if (this._state === 'break') text = `☕ ${this._fmt(this._remaining)}`;
        else if (this._state === 'paused') text = '⏸ Pause';
        this._label?.set_text(text);

        // Stats menu
        const total = this._settings.get_uint('pomodoro-seconds');
        const m = Math.floor(total / 60);
        const s = total % 60;
        const sessions = this._settings.get_uint('sessions-completed');
        if (this._miStats)
            this._miStats.label.text =
                `Studied: ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} — Sessions: ${sessions}`;
    }
}


