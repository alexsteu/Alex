/* ============================================================
   db.js — Couche de persistance IndexedDB
   - Store "days"     : une entrée par jour (clé = "YYYY-MM-DD")
   - Store "settings" : préférences (objectif protéines, défi lactose)
   - Migration automatique depuis l'ancien localStorage 'journal-sante-v1'
   ============================================================ */

const DB_NAME = 'journal-sante';
const DB_VERSION = 1;
const LEGACY_KEY = 'journal-sante-v1';

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('days')) db.createObjectStore('days', { keyPath: 'date' });
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(store, mode, fn) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    let result;
    Promise.resolve(fn(s)).then(r => { result = r; });
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  }));
}

function reqAsync(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/* ---- Days --------------------------------------------------- */
export async function getAllDays() {
  const rows = await tx('days', 'readonly', s => reqAsync(s.getAll()));
  const map = {};
  for (const row of rows) map[row.date] = row;
  return map;
}

export async function getDay(date) {
  return tx('days', 'readonly', s => reqAsync(s.get(date)));
}

export async function putDay(day) {
  return tx('days', 'readwrite', s => { s.put(day); });
}

export async function deleteDay(date) {
  return tx('days', 'readwrite', s => { s.delete(date); });
}

/* ---- Settings ----------------------------------------------- */
export async function getSettings() {
  const rows = await tx('settings', 'readonly', s => reqAsync(s.getAll()));
  const out = {};
  for (const row of rows) out[row.key] = row.value;
  return out;
}

export async function putSetting(key, value) {
  return tx('settings', 'readwrite', s => { s.put({ key, value }); });
}

/* ---- Migration depuis localStorage -------------------------- */
export async function migrateLegacyIfNeeded() {
  const done = await tx('settings', 'readonly', s => reqAsync(s.get('__migrated__')));
  if (done) return false;
  let migrated = 0;
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      for (const [date, day] of Object.entries(data)) {
        if (day && typeof day === 'object') { await putDay({ date, ...day }); migrated++; }
      }
    }
  } catch (e) { /* données legacy illisibles : on ignore proprement */ }
  await putSetting('__migrated__', true);
  return migrated;
}

/* ---- Import / remplacement en masse ------------------------- */
export async function importDays(dataMap) {
  let count = 0;
  for (const [date, day] of Object.entries(dataMap || {})) {
    if (day && typeof day === 'object') {
      const { date: _, ...rest } = day;
      await putDay({ date, ...rest });
      count++;
    }
  }
  return count;
}
