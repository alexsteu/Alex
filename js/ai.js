/* ============================================================
   ai.js — Analyse photo des repas
   Appelle la fonction serverless /api/analyze.
   La clé API Anthropic reste côté serveur — jamais ici.
   ============================================================ */

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/**
 * @param {File} file  image du plat
 * @param {'protein'|'meal'} target
 * @returns {Promise<{description:string, proteins:number, detail:string}>}
 */
export async function analyzePhoto(file, target) {
  const base64 = await fileToBase64(file);
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      target,
      image: base64,
      mediaType: file.type || 'image/jpeg',
    }),
  });

  if (!res.ok) {
    let msg = `Erreur ${res.status}`;
    try { const e = await res.json(); if (e.error) msg = e.error; } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  // Garde-fous : on normalise la réponse
  return {
    description: String(data.description || 'Repas').slice(0, 60),
    proteins: Math.max(0, Math.round(Number(data.proteins) || 0)),
    detail: String(data.detail || '').slice(0, 140),
  };
}
