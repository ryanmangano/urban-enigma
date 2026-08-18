/* North Star Bakery — localStorage helpers
   Small wrapper so every page reads and writes JSON data the same way. */

function getStoredJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn('Could not read stored data for ' + key, err);
    return fallback;
  }
}

function setStoredJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Could not save data for ' + key, err);
  }
}
