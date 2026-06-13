import { admin, db } from './lib/firebase.js';

// The 8 valid gamemodes for SlamTiers
const VALID_GAMEMODES = new Set([
  'mace',
  'sword',
  'diapot',
  'nethpot',
  'smp',
  'builduhc',
  'axe',
  'crystal'
]);

/**
 * Handles Vercel Serverless POST requests to update/promote a player's gamemode rank.
 */
export default async function handler(req, res) {
  // Enforce POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // 1. Verify Bearer token authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
  }

  const token = authHeader.substring(7);
  const secret = process.env.INTERNAL_API_SECRET || "A@V>Wr]qs~_,?6E#*L9)2=4dXxc4PNdE";

  if (token !== secret) {
    return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
  }

  // 2. Validate request payload
  const { discordId, tier, points, username, avatarUrl } = req.body;
  let { gamemode } = req.body;

  if (!discordId) {
    return res.status(400).json({ error: 'Bad Request: Missing required field discordId' });
  }

  // Fallback: derive gamemode from route pathname if not defined
  if (!gamemode) {
    const pathLowers = (req.url || req.path || '').toLowerCase();
    for (const validGm of VALID_GAMEMODES) {
      if (pathLowers.includes(validGm)) {
        gamemode = validGm;
        break;
      }
    }
  }

  if (!gamemode || !VALID_GAMEMODES.has(gamemode)) {
    return res.status(400).json({
      error: `Bad Request: Invalid or missing gamemode. Must be one of: ${Array.from(VALID_GAMEMODES).join(', ')}`
    });
  }

  if (tier === undefined || points === undefined) {
    return res.status(400).json({ error: 'Bad Request: Missing required fields (tier or points)' });
  }

  try {
    // Explicitly parse values to numbers
    const numPoints = Number(points);
    if (isNaN(numPoints)) {
      return res.status(400).json({ error: 'Bad Request: points must be numerical' });
    }

    // Mapping weights
    const TIER_WEIGHTS = {
      'HT1': 1, 'LT1': 2,
      'HT2': 3, 'LT2': 4,
      'HT3': 5, 'LT3': 6,
      'HT4': 7, 'LT4': 8,
      'HT5': 9, 'LT5': 10,
    };

    const getTierWeightFromTier = (t) => {
      if (!t) return 11;
      const normalized = String(t).trim().toUpperCase();
      return TIER_WEIGHTS[normalized] !== undefined ? TIER_WEIGHTS[normalized] : 11;
    };

    const calculatedWeight = req.body.tierWeight !== undefined 
      ? Number(req.body.tierWeight) 
      : (req.body.weight !== undefined ? Number(req.body.weight) : getTierWeightFromTier(tier));

    const playerRef = db.collection('players').doc(String(discordId));
    const now = admin.firestore.FieldValue.serverTimestamp();

    const gamemodeData = {
      tier: String(tier),
      points: numPoints,
      tierWeight: calculatedWeight,
      updatedAt: now
    };

    // Deep merge payload to prevent clobbering other gamemodes
    const initialOrMergePayload = {
      discordId: String(discordId),
      username: username ? String(username) : (req.body.id || String(discordId)),
      avatarUrl: avatarUrl ? String(avatarUrl) : null,
      gamemodes: {
        [gamemode]: gamemodeData
      },
      lastUpdated: now
    };

    await playerRef.set(initialOrMergePayload, { merge: true });

    return res.status(200).json({
      success: true,
      channelId: '1501282759983763487',
      message: `Successfully set gamemode ${gamemode} mapping and deep merged in Firestore.`
    });

  } catch (error) {
    console.error(`Error updating player document [${discordId}] error:`, error);
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
}
