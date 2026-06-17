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

  let rawUsername = username ? String(username).trim() : '';
  if (!rawUsername && req.body.id) {
    rawUsername = String(req.body.id).trim();
  }

  let finalDiscordId = discordId ? String(discordId).trim() : '';
  let finalUsername = rawUsername || (finalDiscordId ? `Player_${finalDiscordId.substring(0, 4)}` : '');

  // Identity Mapping: Map linked identities (such as PlanetLord and blurr) to a single leaderboard entry
  const isLinkedPlanetLordOrBlurr = 
    finalUsername.toLowerCase() === 'planetlord' || 
    finalUsername.toLowerCase() === 'blurr' ||
    finalDiscordId === 'planetlord_linked_id' ||
    finalDiscordId === 'blurr_linked_id';

  if (isLinkedPlanetLordOrBlurr) {
    console.log(`[Identity Mapping API] Mapping linked identity for "${finalUsername}" (ID: "${finalDiscordId}") to canonical PlanetLord entry.`);
    finalDiscordId = 'planetlord_linked_id';
    finalUsername = 'PlanetLord';
  }

  if (!finalDiscordId) {
    console.warn(`[Ambiguous Payload Flagged API] Route ${req.url}: Missing discordId in request`);
    return res.status(400).json({ 
      success: false, 
      error: 'Ambiguous Data Flagged: Missing required parameter "discordId". Please review payload.' 
    });
  }

  // Fallback: derive gamemode from route pathname if not defined
  let finalGamemode = gamemode ? String(gamemode).trim().toLowerCase() : '';
  if (!finalGamemode) {
    const pathLowers = (req.url || req.path || '').toLowerCase();
    for (const validGm of VALID_GAMEMODES) {
      if (pathLowers.includes(validGm)) {
        finalGamemode = validGm;
        break;
      }
    }
  }

  if (!finalGamemode || !VALID_GAMEMODES.has(finalGamemode)) {
    console.warn(`[Ambiguous Payload Flagged API] Route ${req.url}: Invalid/missing gamemode "${finalGamemode}" for player ${finalUsername}`);
    return res.status(400).json({
      success: false,
      error: `Ambiguous Data Flagged: Invalid or missing gamemode "${finalGamemode}". Must be one of: ${Array.from(VALID_GAMEMODES).join(', ')}`
    });
  }

  if (tier === undefined) {
    console.warn(`[Ambiguous Payload Flagged API] Route ${req.url}: Missing tier payload for player ${finalUsername}`);
    return res.status(400).json({ 
      success: false, 
      error: 'Ambiguous Data Flagged: Missing required parameter "tier". Please specify a tier (e.g. HT1).' 
    });
  }

  const finalTier = String(tier).trim().toUpperCase();

  // Mapping weights
  const TIER_WEIGHTS = {
    'HT1': 1, 'LT1': 2,
    'HT2': 3, 'LT2': 4,
    'HT3': 5, 'LT3': 6,
    'HT4': 7, 'LT4': 8,
    'HT5': 9, 'LT5': 10,
  };

  const TIER_POINTS = {
    'HT1': 60, 'LT1': 40,
    'HT2': 30, 'LT2': 25,
    'HT3': 20, 'LT3': 15,
    'HT4': 12, 'LT4': 8,
    'HT5': 5,  'LT5': 2,
  };

  const getTierWeightFromTier = (t) => {
    if (!t) return 11;
    const normalized = String(t).trim().toUpperCase();
    return TIER_WEIGHTS[normalized] !== undefined ? TIER_WEIGHTS[normalized] : 11;
  };

  const getPointsFromTier = (t) => {
    if (!t) return 0;
    const normalized = String(t).trim().toUpperCase();
    return TIER_POINTS[normalized] || 0;
  };

  const calculatedWeight = getTierWeightFromTier(finalTier);

  if (calculatedWeight === 11) {
    console.warn(`[Ambiguous Payload Flagged API] Route ${req.url}: Invalid tier "${finalTier}" received for player ${finalUsername}`);
    return res.status(400).json({
      success: false,
      error: `Ambiguous Data Flagged: Invalid tier "${finalTier}". Tiers must be between LT5 and HT1.`
    });
  }

  try {
    // Explicitly parse values to numbers or fallback to dynamic translation from tier weight hierarchy
    let numPoints = points !== undefined && points !== null ? Number(points) : getPointsFromTier(finalTier);
    if (isNaN(numPoints) || points === '') {
      numPoints = getPointsFromTier(finalTier);
    }

    const playerRef = db.collection('players').doc(String(finalDiscordId));
    const now = admin.firestore.FieldValue.serverTimestamp();

    const gamemodeData = {
      tier: finalTier,
      points: numPoints,
      tierWeight: calculatedWeight,
      updatedAt: now
    };

    // Deep merge payload to prevent clobbering other gamemodes
    const initialOrMergePayload = {
      discordId: String(finalDiscordId),
      username: String(finalUsername),
      avatarUrl: avatarUrl ? String(avatarUrl) : null,
      gamemodes: {
        [finalGamemode]: gamemodeData
      },
      lastUpdated: now
    };

    await playerRef.set(initialOrMergePayload, { merge: true });

    return res.status(200).json({
      success: true,
      channelId: '1501282759983763487',
      message: `Successfully set gamemode ${finalGamemode} mapping and deep merged in Firestore.`
    });

  } catch (error) {
    console.error(`Error updating player document [${discordId}] error:`, error);
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
}
