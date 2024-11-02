import { BLOCKS_CUSTOM, Theme } from '.';

const matchMedia = query => (window.matchMedia ? window.matchMedia(query) : null);
const PREFERS_HIGH_CONTRAST_QUERY = matchMedia('(prefers-contrast: more)');
const PREFERS_DARK_QUERY = matchMedia('(prefers-color-scheme: dark)');

const STORAGE_KEY = 'tw:theme';

/**
 * @returns {Theme} detected theme
 */
const systemPreferencesTheme = () => {
    console.log("Detecting system preferences...");
    if (PREFERS_HIGH_CONTRAST_QUERY && PREFERS_HIGH_CONTRAST_QUERY.matches) {
        console.log("High contrast mode detected.");
        return Theme.highContrast;
    }
    if (PREFERS_DARK_QUERY && PREFERS_DARK_QUERY.matches) {
        console.log("Dark mode detected.");
        return Theme.dark;
    }
    console.log("Light mode detected.");
    return Theme.light;
};

/**
 * @param {function} onChange callback; no guarantees about arguments
 * @returns {function} call to remove event listeners to prevent memory leak
 */
const onSystemPreferenceChange = onChange => {
    console.log("Setting up system preference change listener...");
    if (
        !PREFERS_HIGH_CONTRAST_QUERY ||
        !PREFERS_DARK_QUERY ||
        !PREFERS_HIGH_CONTRAST_QUERY.addEventListener ||
        !PREFERS_DARK_QUERY.addEventListener
    ) {
        console.warn("Media queries or event listeners not supported.");
        return () => {};
    }

    PREFERS_HIGH_CONTRAST_QUERY.addEventListener('change', onChange);
    PREFERS_DARK_QUERY.addEventListener('change', onChange);
    console.log("Event listeners added for system preference changes.");

    return () => {
        PREFERS_HIGH_CONTRAST_QUERY.removeEventListener('change', onChange);
        PREFERS_DARK_QUERY.removeEventListener('change', onChange);
        console.log("Event listeners removed.");
    };
};

/**
 * @returns {Theme} the theme
 */
const detectTheme = () => {
    console.log("Detecting theme...");
    const systemPreferences = systemPreferencesTheme();

    try {
        const local = localStorage.getItem(STORAGE_KEY);
        console.log("Local storage theme:", local);

        // Migrate legacy preferences
        if (local === 'dark') {
            console.log("Legacy dark theme detected in storage.");
            return Theme.dark;
        }
        if (local === 'light') {
            console.log("Legacy light theme detected in storage.");
            return Theme.light;
        }

        const parsed = JSON.parse(local);
        console.log("Parsed theme from local storage:", parsed);

        return new Theme(
            parsed.accent || systemPreferences.accent,
            parsed.gui || systemPreferences.gui,
            parsed.blocks || systemPreferences.blocks
        );
    } catch (e) {
        console.error("Error parsing theme from local storage:", e);
    }

    console.log("Using system preferences theme as fallback:", systemPreferences);
    return systemPreferences;
};

/**
 * @param {Theme} theme the theme
 */
const persistTheme = theme => {
    console.log("Persisting theme:", theme);
    const systemPreferences = systemPreferencesTheme();
    const nonDefaultSettings = {};

    if (theme.accent !== systemPreferences.accent) {
        nonDefaultSettings.accent = theme.accent;
    }
    if (theme.gui !== systemPreferences.gui) {
        nonDefaultSettings.gui = theme.gui;
    }
    if (theme.blocks !== systemPreferences.blocks && theme.blocks !== BLOCKS_CUSTOM) {
        nonDefaultSettings.blocks = theme.blocks;
    }

    if (Object.keys(nonDefaultSettings).length === 0) {
        console.log("No non-default settings to save, clearing storage...");
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error("Error clearing theme from local storage:", e);
        }
    } else {
        console.log("Saving non-default settings to local storage:", nonDefaultSettings);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nonDefaultSettings));
        } catch (e) {
            console.error("Error saving theme to local storage:", e);
        }
    }
};

export {
    onSystemPreferenceChange,
    detectTheme,
    persistTheme
};
