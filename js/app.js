/* ============================================================
   app.js — Rendu de l'interface + interactions
   ============================================================ */

import * as S from './store.js';
import { analyzePhoto } from './ai.js';
import { exportData, importData } from './backup.js';
import { lineChart, barChart } from './charts.js';

const COL = { primary:'#7c6af7', green:'#22c55e', orange:'#f59e0b', red:'#ef4444', lime:'#84cc16', blue:'#38bdf8' };

const ui = {
  tab: 'today',
  editingDay: S.dateKey(0),
  analyzing: false,
  analyzingMeal: false,
  errorProtein: '',
  errorMeal: '',
  showManual: false,
  mealTime: '', mealDesc: '',
  manualDesc: '', manualAmount: '',
};

const $app = document.getElementById('app');

/* ---- Utils --------------------------------------------------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

function bellyColor(n) { return n <= 3 ? COL.green : n <= 6 ? COL.orange : COL.red; }
function sleepColor(h) { return h >= 7 ? COL.green : h >= 6 ? COL.orange : COL.red; }

function haptic(ms = 8) { try { navigator.vibrate && navigator.vibrate(ms); } catch {} }

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

function confetti() {
  const wrap = document.createElement('div');
  wrap.className = 'confetti';
  const colors = [COL.primary, COL.green, COL.orange, COL.blue, '#f472b6'];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
    p.style.animationDelay = (Math.random() * 0.3) + 's';
    p.style.transform = `translateY(-12px) rotate(${Math.random()*360}deg)`;
    wrap.appendChild(p);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 3400);
}

/* ---- Composants réutilisables -------------------------------- */
function ringCard(pct, color, value, unit, label) {
  const r = 42, c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(100, Math.max(0, pct)) / 100);
  return `<div class="ring-card">
    <div class="ring">
      <svg viewBox="0 0 100 100">
        <circle class="ring-track" cx="50" cy="50" r="${r}"/>
        <circle class="ring-fill" cx="50" cy="50" r="${r}" stroke="${color}"
                stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
      </svg>
      <div class="ring-center"><div class="ring-value" style="color:${color}">${value}</div><div class="ring-unit">${unit}</div></div>
    </div>
    <div class="ring-label">${label}</div>
  </div>`;
}

/* ============================================================
   VUE : Aujourd'hui
   ============================================================ */
function viewToday() {
  const key = ui.editingDay;
  const day = S.getDay(key);
  const isToday = key === S.dateKey(0);
  const ch = S.challenge();

  const totalProt = S.proteinTotal(day);
  const goal = S.settings().proteinGoal;
  const protPct = Math.min(100, Math.round((totalProt / goal) * 100));
  const protColor = protPct >= 100 ? COL.green : protPct >= 60 ? COL.primary : COL.orange;
  const dur = S.sleepDuration(day.sleepTime, day.wakeTime);

  return `
  ${header(`
    <div class="header-top">
      <div>
        <div class="header-eyebrow">Journal Santé</div>
        <div class="header-date">${esc(S.formatDateLabel(key))}</div>
        <div class="header-sub">🎯 ${esc(ch.name)} · ${ch.done ? 'terminé 🎉' : 'J'+ch.current+'/'+ch.duration} · ⏳ ${ch.daysRemaining}j</div>
      </div>
    </div>
    <div class="segment">
      <button data-act="day" data-arg="0" class="${isToday ? 'active' : ''}">Aujourd'hui</button>
      <button data-act="day" data-arg="-1" class="${!isToday ? 'active' : ''}">Hier</button>
    </div>
  `)}

  <div class="screen screen-enter">

    <!-- Dashboard -->
    <div class="rings">
      ${ringCard(protPct, protColor, totalProt, '/ ' + goal + ' g', 'Protéines')}
      ${ringCard(ch.pct, COL.lime, ch.done ? '✓' : 'J' + ch.current, ch.done ? 'réussi' : '/ ' + ch.duration, esc(ch.name))}
    </div>

    ${isToday && S.hasContent(S.getDay(S.dateKey(-1))) ? `
      <button class="btn btn-ghost" data-act="dup-yesterday">⧉ Copier les infos d'hier</button>` : ''}

    <!-- Sommeil -->
    <div class="card">
      <div class="card-head"><div class="card-title"><span class="emoji">😴</span> Sommeil</div></div>
      <div class="row">
        <div><label class="field-label">Couché à</label><input type="time" data-field="sleepTime" value="${esc(day.sleepTime)}"></div>
        <div><label class="field-label">Levé à</label><input type="time" data-field="wakeTime" value="${esc(day.wakeTime)}"></div>
      </div>
      ${dur ? `<div class="feedback" style="color:${sleepColor(dur.h)}">⏱ ${dur.h}h${dur.m ? String(dur.m).padStart(2,'0') : ''} de sommeil</div>` : ''}
    </div>

    <!-- Ventre -->
    <div class="card">
      <div class="card-head">
        <div class="card-title"><span class="emoji">🫃</span> Ventre</div>
        <div class="card-sub">Gonflement — 1 = plat, 10 = explosion</div>
      </div>
      <div class="belly-grid">
        ${[1,2,3,4,5,6,7,8,9,10].map(n => {
          const active = day.belly === n;
          const c = bellyColor(n);
          return `<button class="belly-btn" data-act="belly" data-arg="${n}"
            style="${active ? `background:${c};color:#fff;box-shadow:0 4px 12px ${c}66` : ''}">${n}</button>`;
        }).join('')}
      </div>
      ${day.belly ? `<div class="feedback" style="color:${bellyColor(day.belly)}">${day.belly<=3?'✨ Ventre calme':day.belly<=6?'⚡ Gonflement modéré':'🔥 Gros gonflement'}</div>` : ''}
    </div>

    <!-- Humeur -->
    <div class="card">
      <div class="card-head"><div class="card-title"><span class="emoji">🧠</span> Humeur</div></div>
      <div class="mood-row">
        ${S.MOODS.map(m => `
          <button class="mood-btn ${day.mood === m.label ? 'active' : ''}" data-act="mood" data-arg="${esc(m.label)}">
            <span class="mood-emoji">${m.emoji}</span><span class="mood-label">${m.label}</span>
          </button>`).join('')}
      </div>
    </div>

    <!-- Sport -->
    <div class="card">
      <div class="card-head"><div class="card-title"><span class="emoji">💪</span> Sport</div></div>
      <div class="toggle-row">
        <button class="toggle ${day.sport === true ? 'on' : ''}" data-act="sport-yes">✅ Oui</button>
        <button class="toggle ${day.sport === false ? 'off' : ''}" data-act="sport-no">❌ Non</button>
      </div>
      ${day.sport ? `<div class="chips">
        ${S.MUSCLES.map(mu => `<button class="chip ${(day.muscles||[]).includes(mu) ? 'active' : ''}" data-act="muscle" data-arg="${esc(mu)}">${mu}</button>`).join('')}
      </div>` : ''}
    </div>

    <!-- Cannabis -->
    <div class="card">
      <div class="card-head"><div class="card-title"><span class="emoji">🌿</span> Cannabis</div></div>
      <div class="row">
        <div><label class="field-label">1er bedo à</label><input type="time" data-field="weedFirst" value="${esc(day.weedFirst)}"></div>
        <div><label class="field-label">Nombre total</label><input type="number" min="0" max="30" inputmode="numeric" placeholder="ex: 4" data-field="weedCount" value="${esc(day.weedCount)}"></div>
      </div>
      ${(day.weedFirst || day.weedCount) ? `<div class="feedback" style="color:${COL.lime}">${day.weedFirst ? 'Premier à '+esc(day.weedFirst) : ''}${day.weedFirst && day.weedCount ? ' · ' : ''}${day.weedCount ? esc(day.weedCount)+' au total' : ''}</div>` : ''}
    </div>

    <!-- Repas -->
    <div class="card">
      <div class="card-head"><div class="card-title"><span class="emoji">🍽️</span> Repas du jour</div></div>
      ${(day.meals||[]).map(m => `
        <div class="item">
          <div class="item-main"><div class="item-title">${esc(m.desc)}</div><div class="item-meta">🕐 ${esc(m.time)}</div></div>
          <button class="icon-btn" data-act="del-meal" data-arg="${m.id}">✕</button>
        </div>`).join('')}
      <div style="margin-top:10px">
        <div class="row" style="margin-bottom:8px">
          <div style="flex:0 0 110px"><input type="time" data-state="mealTime" value="${esc(ui.mealTime)}"></div>
          <div><input type="text" data-state="mealDesc" placeholder="Nom du repas…" value="${esc(ui.mealDesc)}"></div>
        </div>
        <div class="btn-row">
          <button class="btn btn-dashed" data-act="meal-photo" ${ui.analyzingMeal ? 'disabled' : ''}>${ui.analyzingMeal ? '<span class="spin"></span> Analyse…' : '📸 Photo'}</button>
          <button class="btn btn-soft" data-act="meal-add">＋ Ajouter</button>
        </div>
        ${ui.errorMeal ? `<div class="error">${esc(ui.errorMeal)}</div>` : ''}
      </div>
    </div>

    <!-- Protéines -->
    <div class="card">
      <div class="card-head">
        <div class="card-title"><span class="emoji">🥩</span> Protéines</div>
        <div class="card-sub">Objectif : ${goal} g par jour</div>
      </div>
      <div class="spread" style="align-items:flex-end;margin-bottom:8px">
        <div style="font-size:30px;font-weight:800;letter-spacing:-1px;color:${protPct>=100?COL.green:'var(--text)'}">${totalProt}<span style="font-size:15px;color:var(--muted);font-weight:600"> g</span></div>
        <div class="muted" style="font-size:13px">${protPct>=100 ? '🎉 Objectif atteint !' : 'Reste '+(goal-totalProt)+' g'}</div>
      </div>
      <div class="bar"><div class="bar-fill" style="width:${protPct}%;background:${protColor}"></div></div>

      ${(day.proteins||[]).map(p => `
        <div class="item">
          <div class="item-main"><div class="item-title">${esc(p.description)}</div><div class="item-meta">${esc(p.detail)}${p.detail && p.time ? ' · ' : ''}${esc(p.time)}</div></div>
          <div style="display:flex;align-items:center;gap:8px">
            <span class="item-amount">+${p.amount} g</span>
            <button class="icon-btn" data-act="del-protein" data-arg="${p.id}">✕</button>
          </div>
        </div>`).join('')}

      ${ui.showManual ? `
        <div class="item" style="display:block">
          <div class="row" style="margin-bottom:8px">
            <div style="flex:1"><input type="text" data-state="manualDesc" placeholder="Repas (ex: poulet grillé)" value="${esc(ui.manualDesc)}"></div>
            <div style="flex:0 0 72px"><input type="number" inputmode="numeric" data-state="manualAmount" placeholder="g" value="${esc(ui.manualAmount)}"></div>
          </div>
          <div class="btn-row">
            <button class="btn btn-ghost" data-act="manual-cancel">Annuler</button>
            <button class="btn btn-soft" data-act="manual-add">Ajouter</button>
          </div>
        </div>` : ''}

      <div class="btn-row" style="margin-top:10px">
        <button class="btn btn-dashed-primary" data-act="protein-photo" ${ui.analyzing ? 'disabled' : ''}>${ui.analyzing ? '<span class="spin"></span> Analyse…' : '📸 Photo → protéines'}</button>
        <button class="btn btn-dashed" data-act="manual-open" style="flex:0 0 auto;padding-left:16px;padding-right:16px">✏️ Manuel</button>
      </div>
      ${ui.errorProtein ? `<div class="error">${esc(ui.errorProtein)}</div>` : ''}
    </div>

    <!-- Notes -->
    <div class="card">
      <div class="card-head"><div class="card-title"><span class="emoji">📝</span> Notes</div></div>
      <textarea rows="3" data-field="notes" placeholder="Ressenti, observations…">${esc(day.notes)}</textarea>
    </div>

  </div>`;
}

/* ============================================================
   VUE : Tendances
   ============================================================ */
function viewTrends() {
  const N = 14;
  const days = S.lastNDays(N);
  const goal = S.settings().proteinGoal;

  const belly   = days.map(d => ({ key: d.key, value: d.day.belly ?? null }));
  const protein = days.map(d => ({ key: d.key, value: S.hasContent(d.day) || (d.day.proteins||[]).length ? S.proteinTotal(d.day) : null }));
  const sleep   = days.map(d => { const s = S.sleepDuration(d.day.sleepTime, d.day.wakeTime); return { key: d.key, value: s ? +(s.total/60).toFixed(1) : null }; });
  const mood    = days.map(d => ({ key: d.key, value: S.moodScore(d.day.mood) }));
  const weed    = days.map(d => ({ key: d.key, value: d.day.weedCount ? Number(d.day.weedCount) : null }));

  const lastVal = arr => { const v = [...arr].reverse().find(p => p.value != null); return v ? v.value : '—'; };

  const card = (emoji, title, now, svg, legend = '') => `
    <div class="chart-card">
      <div class="chart-head">
        <div class="chart-title"><span>${emoji}</span> ${title}</div>
        <div class="chart-now">${now}</div>
      </div>
      <div class="chart">${svg}</div>
      ${legend ? `<div class="legend">${legend}</div>` : ''}
    </div>`;

  return `
  ${header(`<div class="header-eyebrow">Analyse</div><div class="header-date">Tendances</div><div class="header-sub">14 derniers jours · repère tes corrélations</div>`)}
  <div class="screen screen-enter">
    ${card('🥩', 'Protéines', lastVal(protein) + ' g', barChart(protein, { color: COL.primary, min: 0, goal }),
        `<span><i class="dot" style="background:${COL.primary}"></i>par jour</span><span><i class="dot" style="background:${COL.green}"></i>objectif ${goal} g</span>`)}
    ${card('🫃', 'Ventre (gonflement)', lastVal(belly) + '/10', lineChart(belly, { color: COL.orange, min: 1, max: 10 }))}
    ${card('😴', 'Sommeil', (lastVal(sleep) === '—' ? '—' : lastVal(sleep) + ' h'), barChart(sleep, { color: COL.blue, min: 0, goal: 7 }),
        `<span><i class="dot" style="background:${COL.blue}"></i>heures</span><span><i class="dot" style="background:${COL.green}"></i>cible 7 h</span>`)}
    ${card('🧠', 'Humeur', moodEmoji(lastVal(mood)), lineChart(mood, { color: COL.green, min: 1, max: 5 }))}
    ${card('🌿', 'Cannabis', (lastVal(weed) === '—' ? '—' : lastVal(weed) + '/j'), barChart(weed, { color: COL.lime, min: 0 }))}
    <div class="hint">💡 Compare les courbes pour repérer des liens : p. ex. les jours à fort gonflement, ou l'effet du cannabis sur ton sommeil.</div>
  </div>`;
}

function moodEmoji(score) {
  if (score === '—' || score == null) return '—';
  const m = S.MOODS.find(x => x.score === Math.round(score));
  return m ? m.emoji : '—';
}

/* ============================================================
   VUE : Historique
   ============================================================ */
function viewHistory() {
  const keys = S.historyKeys();
  const goal = S.settings().proteinGoal;
  const body = keys.length === 0
    ? `<div class="empty">Pas encore d'historique.<br>Tes journées passées apparaîtront ici 👋</div>`
    : keys.map(key => {
        const d = S.getDay(key);
        const prot = S.proteinTotal(d);
        const sd = S.sleepDuration(d.sleepTime, d.wakeTime);
        const tag = (bg, col, txt) => `<span class="tag" style="background:${col}22;color:${col}">${txt}</span>`;
        return `<div class="hist-item">
          <div class="hist-date">${esc(S.formatShort(key))}</div>
          <div class="hist-tags">
            ${d.belly ? tag(0, bellyColor(d.belly), `🫃 ${d.belly}/10`) : ''}
            ${d.mood ? tag(0, COL.primary, `🧠 ${esc(d.mood)}`) : ''}
            ${d.sport === true ? tag(0, COL.green, `💪 ${esc((d.muscles||[]).join(', ') || 'Sport')}`) : ''}
            ${d.sport === false ? `<span class="tag" style="background:#ffffff10;color:var(--muted)">😴 Repos</span>` : ''}
            ${d.weedFirst || d.weedCount ? tag(0, COL.lime, `🌿 ${esc(d.weedFirst || '')}${d.weedFirst && d.weedCount ? ' · ' : ''}${d.weedCount ? esc(d.weedCount)+'×' : ''}`) : ''}
            ${prot > 0 ? tag(0, prot >= goal ? COL.green : COL.orange, `🥩 ${prot} g`) : ''}
            ${sd ? tag(0, sleepColor(sd.h), `😴 ${sd.h}h${sd.m?String(sd.m).padStart(2,'0'):''}`) : ''}
          </div>
          ${d.notes ? `<div class="hist-notes">« ${esc(d.notes)} »</div>` : ''}
        </div>`;
      }).join('');

  return `
  ${header(`<div class="header-eyebrow">Journal</div><div class="header-date">Historique</div>`)}
  <div class="screen screen-enter">${body}</div>`;
}

/* ============================================================
   VUE : Réglages
   ============================================================ */
function viewSettings() {
  const s = S.settings();
  const dayCount = S.historyKeys().length + [S.dateKey(0), S.dateKey(-1)].filter(k => S.hasContent(S.getDay(k))).length;
  return `
  ${header(`<div class="header-eyebrow">Préférences</div><div class="header-date">Réglages</div>`)}
  <div class="screen screen-enter">

    <div class="card">
      <div class="card-head"><div class="card-title"><span class="emoji">🥩</span> Objectif protéines</div></div>
      <label class="field-label">Grammes par jour</label>
      <input type="number" inputmode="numeric" min="1" max="400" data-setting="proteinGoal" value="${esc(s.proteinGoal)}">
    </div>

    <div class="card">
      <div class="card-head"><div class="card-title"><span class="emoji">🎯</span> Défi en cours</div><div class="card-sub">Compteur affiché en haut de l'écran</div></div>
      <label class="field-label">Nom du défi</label>
      <input type="text" data-setting="challengeName" value="${esc(s.challengeName)}" placeholder="ex: Sans lactose">
      <div class="row" style="margin-top:10px">
        <div><label class="field-label">Date de début</label><input type="date" data-setting="challengeStart" value="${esc(s.challengeStart)}"></div>
        <div><label class="field-label">Durée (jours)</label><input type="number" inputmode="numeric" min="1" max="365" data-setting="challengeDuration" value="${esc(s.challengeDuration)}"></div>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><div class="card-title"><span class="emoji">💾</span> Sauvegarde</div><div class="card-sub">${dayCount} journée(s) enregistrée(s) sur cet appareil</div></div>
      <button class="btn btn-soft" data-act="export" style="margin-bottom:8px">📤 Exporter mes données</button>
      <button class="btn btn-dashed" data-act="import">📥 Importer une sauvegarde</button>
    </div>

    <div class="card">
      <div class="card-head"><div class="card-title"><span class="emoji">📱</span> Installer sur iPhone</div></div>
      <div class="hint" style="margin-top:0">Dans Safari : bouton <b>Partager</b> ⬆️ → <b>Sur l'écran d'accueil</b>. L'app s'ouvrira en plein écran et fonctionnera hors-ligne.</div>
    </div>

    <div class="hint" style="text-align:center">Journal Santé · PWA · tes données restent sur ton appareil 🔒</div>
  </div>`;
}

/* ---- En-tête + barre d'onglets ------------------------------- */
function header(inner) { return `<div class="header">${inner}</div>`; }

function tabbar() {
  const tabs = [
    ['today', '☀️', 'Aujourd\'hui'],
    ['trends', '📈', 'Tendances'],
    ['history', '🗓️', 'Historique'],
    ['settings', '⚙️', 'Réglages'],
  ];
  return `<nav class="tabbar">${tabs.map(([id, ico, label]) =>
    `<button class="tab ${ui.tab === id ? 'active' : ''}" data-act="tab" data-arg="${id}">
       <span class="tab-ico">${ico}</span><span>${label}</span>
     </button>`).join('')}</nav>`;
}

/* ---- Rendu --------------------------------------------------- */
function render() {
  const view = ui.tab === 'today' ? viewToday()
    : ui.tab === 'trends' ? viewTrends()
    : ui.tab === 'history' ? viewHistory()
    : viewSettings();
  $app.innerHTML = view + tabbar();
}

/* ============================================================
   Actions
   ============================================================ */
async function addProteinEntry(entry) {
  const key = ui.editingDay;
  const day = S.getDay(key);
  const before = S.proteinTotal(day);
  const goal = S.settings().proteinGoal;
  await S.updateDay(key, { proteins: [...(day.proteins || []), entry] });
  if (before < goal && before + entry.amount >= goal) { confetti(); toast('🎉 Objectif protéines atteint !'); }
}

async function handleAction(act, arg, el) {
  const key = ui.editingDay;
  const day = S.getDay(key);
  haptic();

  switch (act) {
    case 'tab': ui.tab = arg; render(); window.scrollTo(0, 0); return;
    case 'day': ui.editingDay = S.dateKey(Number(arg)); render(); return;

    case 'belly': await S.updateDay(key, { belly: Number(arg) }); render(); return;
    case 'mood':  await S.updateDay(key, { mood: arg }); render(); return;
    case 'sport-yes': await S.updateDay(key, { sport: true }); render(); return;
    case 'sport-no':  await S.updateDay(key, { sport: false, muscles: [] }); render(); return;
    case 'muscle': {
      const m = day.muscles || [];
      await S.updateDay(key, { muscles: m.includes(arg) ? m.filter(x => x !== arg) : [...m, arg] });
      render(); return;
    }

    case 'meal-add': {
      const time = ui.mealTime, desc = ui.mealDesc.trim();
      if (!time && !desc) return;
      await S.updateDay(key, { meals: [...(day.meals||[]), { id: S.newId(), time: time || '--:--', desc: desc || 'Repas' }] });
      ui.mealTime = ''; ui.mealDesc = ''; ui.errorMeal = ''; render(); return;
    }
    case 'del-meal':
      await S.updateDay(key, { meals: (day.meals||[]).filter(x => String(x.id) !== String(arg)) }); render(); return;
    case 'del-protein':
      await S.updateDay(key, { proteins: (day.proteins||[]).filter(x => String(x.id) !== String(arg)) }); render(); return;

    case 'manual-open':   ui.showManual = true; render(); return;
    case 'manual-cancel': ui.showManual = false; ui.manualDesc = ''; ui.manualAmount = ''; render(); return;
    case 'manual-add': {
      const amount = parseInt(ui.manualAmount, 10);
      if (!amount || amount <= 0) { ui.errorProtein = 'Indique une quantité valide.'; render(); return; }
      await addProteinEntry({ id: S.newId(), description: ui.manualDesc.trim() || 'Repas', amount, detail: 'Ajout manuel', time: nowTime() });
      ui.manualDesc = ''; ui.manualAmount = ''; ui.showManual = false; ui.errorProtein = ''; render(); return;
    }

    case 'protein-photo': document.getElementById('photoProtein').click(); return;
    case 'meal-photo':    document.getElementById('photoMeal').click(); return;

    case 'dup-yesterday': {
      const y = S.getDay(S.dateKey(-1));
      const { date, ...rest } = y;
      // ids frais pour les listes copiées
      rest.meals = (rest.meals||[]).map(m => ({ ...m, id: S.newId() }));
      rest.proteins = (rest.proteins||[]).map(p => ({ ...p, id: S.newId() }));
      await S.updateDay(key, rest);
      toast('Copié depuis hier'); render(); return;
    }

    case 'export': exportData(); toast('Sauvegarde téléchargée 📤'); return;
    case 'import': document.getElementById('importFile').click(); return;
  }
}

function nowTime() { return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }

/* ---- Photo handlers ------------------------------------------ */
async function onProteinPhoto(file) {
  ui.analyzing = true; ui.errorProtein = ''; render();
  try {
    const r = await analyzePhoto(file, 'protein');
    ui.analyzing = false;
    await addProteinEntry({ id: S.newId(), description: r.description, amount: r.proteins, detail: r.detail, time: nowTime() });
    render();
  } catch (e) {
    ui.analyzing = false; ui.errorProtein = (e.message || 'Erreur') + ' — réessaie ou ajoute en manuel.'; render();
  }
}
async function onMealPhoto(file) {
  ui.analyzingMeal = true; ui.errorMeal = ''; render();
  try {
    const r = await analyzePhoto(file, 'meal');
    ui.mealDesc = r.description; ui.analyzingMeal = false; render();
  } catch (e) {
    ui.analyzingMeal = false; ui.errorMeal = (e.message || 'Erreur') + ' — réessaie.'; render();
  }
}

/* ---- Settings field ------------------------------------------ */
async function onSettingChange(key, value) {
  if (key === 'proteinGoal' || key === 'challengeDuration') value = Math.max(1, parseInt(value, 10) || 1);
  await S.setSetting(key, value);
  render();
}

/* ============================================================
   Délégation d'événements
   ============================================================ */
$app.addEventListener('click', e => {
  const btn = e.target.closest('[data-act]');
  if (btn) { e.preventDefault(); handleAction(btn.dataset.act, btn.dataset.arg, btn); }
});
$app.addEventListener('change', e => {
  const f = e.target.closest('[data-field]');
  if (f) { S.updateDay(ui.editingDay, { [f.dataset.field]: f.value }).then(render); return; }
  const st = e.target.closest('[data-setting]');
  if (st) { onSettingChange(st.dataset.setting, st.value); return; }
});
$app.addEventListener('input', e => {
  const t = e.target.closest('[data-state]');
  if (t) ui[t.dataset.state] = t.value;   // pas de re-render : on garde le focus
});

document.getElementById('photoProtein').addEventListener('change', function () { if (this.files[0]) onProteinPhoto(this.files[0]); this.value = ''; });
document.getElementById('photoMeal').addEventListener('change', function () { if (this.files[0]) onMealPhoto(this.files[0]); this.value = ''; });
document.getElementById('importFile').addEventListener('change', async function () {
  if (!this.files[0]) return;
  try { const n = await importData(this.files[0]); toast(`✅ ${n} journée(s) importée(s)`); render(); }
  catch (err) { toast('❌ ' + err.message); }
  this.value = '';
});

/* ============================================================
   Démarrage
   ============================================================ */
async function start() {
  await S.init();
  render();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
}
start();
