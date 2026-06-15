/* ============================================================
   store.js — État applicatif + logique métier
   ============================================================ */

import * as db from './db.js';

export const MOODS = [
  { emoji: '😁', label: 'Super', score: 5 },
  { emoji: '🙂', label: 'Bien',  score: 4 },
  { emoji: '😐', label: 'Moyen', score: 3 },
  { emoji: '😔', label: 'Bof',   score: 2 },
  { emoji: '😤', label: 'Mal',   score: 1 },
];
export const MUSCLES = ['Pecs', 'Dos', 'Épaules', 'Bras', 'Jambes', 'Abdos', 'Full body', 'Cardio'];

const DEFAULT_SETTINGS = {
  proteinGoal: 130,
  challengeName: 'Sans lactose',
  challengeStart: '2026-06-15',
  challengeDuration: 21,
  quote: '',
  sectionOrder: ['sleep', 'belly', 'mood', 'sport', 'cannabis', 'meals', 'proteins', 'notes'],
};

function emptyDay(date) {
  return {
    date,
    belly: null, mood: null,
    sport: null, muscles: [],
    weedFirst: '', weedCount: '',
    sleepTime: '', wakeTime: '',
    meals: [], proteins: [], notes: '',
  };
}

/* In-memory cache hydraté au démarrage */
export const store = {
  days: {},               // { 'YYYY-MM-DD': day }
  settings: { ...DEFAULT_SETTINGS },
};

export async function init() {
  await db.migrateLegacyIfNeeded();
  store.days = await getAllDaysNormalized();
  store.settings = { ...DEFAULT_SETTINGS, ...(await db.getSettings()) };
  delete store.settings.__migrated__;
  return store;
}

async function getAllDaysNormalized() {
  const raw = await db.getAllDays();
  const out = {};
  for (const [date, d] of Object.entries(raw)) out[date] = { ...emptyDay(date), ...d, date };
  return out;
}

/* ---- Dates --------------------------------------------------- */
export function dateKey(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toKey(d);
}
export function toKey(d) {
  // Clé locale (évite le décalage UTC de toISOString)
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function parseKey(key) { return new Date(key + 'T12:00:00'); }

export function formatDateLabel(key) {
  const opts = { weekday: 'long', day: 'numeric', month: 'long' };
  if (key === dateKey(0)) return capitalize(parseKey(key).toLocaleDateString('fr-FR', opts));
  if (key === dateKey(-1)) return 'Hier — ' + parseKey(key).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  return capitalize(parseKey(key).toLocaleDateString('fr-FR', opts));
}
export function formatShort(key) {
  return capitalize(parseKey(key).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }));
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ---- Accès / mutation des jours ------------------------------ */
export function getDay(key) {
  return store.days[key] || emptyDay(key);
}

export async function updateDay(key, patch) {
  const next = { ...getDay(key), ...patch, date: key };
  store.days[key] = next;
  await db.putDay(next);
  return next;
}

/* ---- Calculs métier ------------------------------------------ */
export function sleepDuration(sleepTime, wakeTime) {
  if (!sleepTime || !wakeTime) return null;
  const [sh, sm] = sleepTime.split(':').map(Number);
  const [wh, wm] = wakeTime.split(':').map(Number);
  let mins = (wh * 60 + wm) - (sh * 60 + sm);
  if (mins < 0) mins += 1440;
  return { h: Math.floor(mins / 60), m: mins % 60, total: mins };
}

export function proteinTotal(day) {
  return (day.proteins || []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
}

export function moodScore(label) {
  const m = MOODS.find(x => x.label === label);
  return m ? m.score : null;
}

/* ---- Défi (lactose) ------------------------------------------ */
export function challenge() {
  const { challengeStart, challengeDuration, challengeName } = store.settings;
  const start = parseKey(challengeStart);
  const now = new Date();
  const dayNum = Math.floor((now - start) / 86400000) + 1;
  const current = Math.min(Math.max(dayNum, 0), challengeDuration);
  const end = new Date(start.getTime() + (challengeDuration - 1) * 86400000);
  const daysRemaining = Math.max(0, Math.ceil((end - now) / 86400000));
  return {
    name: challengeName,
    duration: challengeDuration,
    current,
    started: dayNum >= 1,
    done: dayNum > challengeDuration,
    daysRemaining,
    pct: Math.min(100, Math.max(0, Math.round((current / challengeDuration) * 100))),
  };
}

export function settings() { return store.settings; }

export async function setSetting(key, value) {
  store.settings[key] = value;
  await db.putSetting(key, value);
}

/* ---- Tendances : derniers N jours ---------------------------- */
export function lastNDays(n) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const key = dateKey(-i);
    out.push({ key, day: getDay(key) });
  }
  return out;
}

/* ---- Historique : jours passés (y compris hier, hors aujourd'hui) ---- */
export function historyKeys() {
  const today = dateKey(0);
  return Object.keys(store.days)
    .filter(k => k !== today)
    .filter(k => hasContent(store.days[k]))
    .sort((a, b) => b.localeCompare(a));
}

export function hasContent(day) {
  if (!day) return false;
  return Boolean(
    day.belly || day.mood || day.sport !== null ||
    day.weedFirst || day.weedCount || day.sleepTime || day.wakeTime ||
    (day.meals && day.meals.length) || (day.proteins && day.proteins.length) || day.notes
  );
}

/* ---- Export / import ----------------------------------------- */
export function exportObject() {
  const days = {};
  for (const [k, d] of Object.entries(store.days)) {
    const { date, ...rest } = d;
    days[k] = rest;
  }
  return { _app: 'journal-sante', _version: 2, exportedAt: new Date().toISOString(), settings: store.settings, days };
}

export async function importObject(obj) {
  // Accepte le nouveau format {days, settings} ET l'ancien format plat {date: day}
  const days = obj && obj.days ? obj.days : obj;
  const count = await db.importDays(days);
  if (obj && obj.settings) {
    for (const [k, v] of Object.entries(obj.settings)) {
      if (k in DEFAULT_SETTINGS) await setSetting(k, v);
    }
  }
  store.days = await getAllDaysNormalized();
  return count;
}

export function newId() { return Date.now() + Math.floor(Math.random() * 1000); }
