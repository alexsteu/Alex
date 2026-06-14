// ============================================================
// api/analyze.js — Fonction serverless (Vercel)
// Analyse une photo de plat avec l'API Claude (vision).
// La clé ANTHROPIC_API_KEY reste côté serveur — jamais exposée au client.
// ============================================================

import Anthropic from '@anthropic-ai/sdk';

// Modèle par défaut : le plus capable. Surchargeable via la variable
// d'environnement ANTHROPIC_MODEL (ex : claude-sonnet-4-6 pour réduire le coût).
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-8';

// Schéma de sortie structurée : garantit un JSON exploitable.
const SCHEMA = {
  type: 'object',
  properties: {
    description: { type: 'string', description: 'Nom du plat en 3 mots maximum' },
    proteins: { type: 'integer', description: 'Estimation des protéines en grammes' },
    detail: { type: 'string', description: 'Explication courte en une phrase' },
  },
  required: ['description', 'proteins', 'detail'],
  additionalProperties: false,
};

const PROMPTS = {
  protein: "Analyse ce plat et estime sa quantité de protéines en grammes. Sois réaliste et concret. 'detail' explique brièvement ton estimation.",
  meal: "Identifie ce plat en quelques mots. 'proteins' = estimation des protéines en grammes, 'detail' = courte estimation.",
};

export default async function handler(req, res) {
  // CORS (utile en dev si le front tourne sur un autre port)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "Clé API non configurée côté serveur (ANTHROPIC_API_KEY)." });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { image, mediaType = 'image/jpeg', target = 'protein' } = body;
    if (!image) return res.status(400).json({ error: 'Image manquante.' });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { format: { type: 'json_schema', schema: SCHEMA } },
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
          { type: 'text', text: PROMPTS[target] || PROMPTS.protein },
        ],
      }],
    });

    if (response.stop_reason === 'refusal') {
      return res.status(422).json({ error: "Analyse refusée pour cette image." });
    }

    const textBlock = (response.content || []).find(b => b.type === 'text');
    const data = JSON.parse(textBlock?.text || '{}');
    return res.status(200).json(data);

  } catch (err) {
    const status = err?.status && err.status >= 400 && err.status < 600 ? err.status : 502;
    return res.status(status).json({ error: "L'analyse a échoué. Réessaie." });
  }
}
