// prefs.js — GNOME 48
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk?version=4.0';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class PomodoroPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page  = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({ title: 'Settings' });
        page.add(group);

        const addSpin = (title, key, lower, upper) => {
            const row = new Adw.ActionRow({ title });
            const adj = new Gtk.Adjustment({
                lower, upper, step_increment: 1, value: settings.get_int(key)
            });
            const spin = new Gtk.SpinButton({ adjustment: adj, numeric: true });
            spin.connect('value-changed', () => settings.set_int(key, spin.get_value_as_int()));
            row.add_suffix(spin);
            row.activatable_widget = spin;
            group.add(row);
        };

        addSpin('Work (min)', 'work-duration', 1, 180);
        addSpin('Short break (min)', 'short-break', 1, 60);
        addSpin('Long break (min)', 'long-break', 1, 180);
        addSpin('Cycles before the long break', 'cycles-before-long', 1, 12);

        window.add(page);
    }
}

