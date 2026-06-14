/* ============================================================
   backup.js — Export / import des données (JSON)
   ============================================================ */

import { exportObject, importObject } from './store.js';

export function exportData() {
  const json = JSON.stringify(exportObject(), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `journal-sante-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = async e => {
      try {
        const obj = JSON.parse(e.target.result);
        const count = await importObject(obj);
        resolve(count);
      } catch (err) {
        reject(new Error('Fichier invalide'));
      }
    };
    r.onerror = () => reject(new Error('Lecture impossible'));
    r.readAsText(file);
  });
}
