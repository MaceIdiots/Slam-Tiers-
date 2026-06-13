import { db } from './lib/firebase.js';

// Valid gamemodes to perform individual filters & scoring
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

// Static points mapped from tiers for calculating the Overall Leaderboard
const TIER_POINTS = {
  'HT1': 50, 'LT1': 40,
  'HT2': 30, 'LT2': 25,
  'HT3': 20, 'LT3': 15,
  'HT4': 12, 'LT4': 8,
  'HT5': 5,  'LT5': 2,
};

/**
 * Resolves static points score for a specific tier string (case-insensitive).
 */
function getPointsFromTier(tier) {
  if (!tier) return 0;
  const normalized = String(tier).trim().toUpperCase();
  return TIER_POINTS[normalized] || 0;
}

/**
 * Assigns an Achievement Title based on cumulative score thresholds.
 */
function getAchievementTitle(points) {
  if (points >= 400) return '👑 Combat Grandmaster';
  if (points >= 250) return '⚔️ Combat Master';
  if (points >= 100) return '💎 Combat Ace';
  if (points >= 50) return '🔥 Combat Specialist';
  if (points >= 20) return '🛡️ Combat Cadet';
  if (points >= 10) return '🎯 Combat Novice';
  return '🪵 Rookie';
}

/**
 * Handles Vercel Serverless GET requests to fetch Discord/web leaderboard lists.
 */
export default async function handler(req, res) {
  // Enforce GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { mode } = req.query;

  if (!mode) {
    return res.status(400).json({ error: 'Bad Request: Missing required query parameter "mode"' });
  }

  const normalizedMode = mode.trim().toLowerCase();

  try {
    // Read players collection snapshot
    const playersSnapshot = await db.collection('players').get();
    const allPlayersDocs = [];

    if (playersSnapshot.empty) {
      const HISTORICAL_ROSTER = [
        { id: "fagzy_noah", mode: "mace", tier: "LT4", points: 8, weight: 8 },
        { id: "adiaytz", mode: "nethpot", tier: "LT4", points: 8, weight: 8 },
        { id: "ElevenDragon_", mode: "smp", tier: "HT4", points: 12, weight: 7 },
        { id: "Vielaz", mode: "sword", tier: "LT3", points: 15, weight: 6 },
        { id: "Noob", mode: "mace", tier: "LT5", points: 2, weight: 10 },
        { id: "XenonBladez", mode: "diapot", tier: "LT4", points: 8, weight: 8 },
        { id: "OnlyMortal", mode: "diapot", tier: "LT3", points: 15, weight: 6 },
        { id: "RealMADDY_9157", mode: "smp", tier: "LT4", points: 8, weight: 8 },
        { id: "just._.shuffled", mode: "mace", tier: "LT4", points: 8, weight: 8 },
        { id: "Greeb", mode: "sword", tier: "LT4", points: 8, weight: 8 },
        { id: "DiabloSentex", mode: "mace", tier: "HT5", points: 5, weight: 9 },
        { id: "LamM2sz1uai", mode: "sword", tier: "LT3", points: 15, weight: 6 },
        { id: "Zorxk._", mode: "diapot", tier: "LT3", points: 15, weight: 6 },
        { id: "Anish_CR7", mode: "sword", tier: "LT4", points: 8, weight: 8 },
        { id: "spawnquy1", mode: "sword", tier: "LT3", points: 15, weight: 6 },
        { id: "xadvancedTT", mode: "mace", tier: "HT4", points: 12, weight: 7 },
        { id: "Midnight_amura", mode: "mace", tier: "LT4", points: 8, weight: 8 },
        { id: "Void", mode: "mace", tier: "LT2", points: 25, weight: 4 },
        { id: "Kris_CS", mode: "mace", tier: "LT2", points: 25, weight: 4 }
      ];

      for (const p of HISTORICAL_ROSTER) {
        allPlayersDocs.push({
          id: p.id,
          discordId: p.id,
          username: p.id,
          avatarUrl: null,
          gamemodes: {
            [p.mode]: {
              tier: p.tier,
              points: p.points,
              tierWeight: p.weight,
              updatedAt: new Date()
            }
          }
        });
      }
    } else {
      playersSnapshot.forEach(doc => {
        allPlayersDocs.push({
          id: doc.id,
          ...doc.data()
        });
      });
    }

    if (normalizedMode === 'overall') {
      // 1. Calculate and build the cumulative OVERALL leaderboard
      const results = allPlayersDocs.map(player => {
        let totalPoints = 0;
        const breakdown = {};

        // Calculate points across all 8 active gamemodes
        for (const gm of VALID_GAMEMODES) {
          const gmData = player.gamemodes && player.gamemodes[gm];
          const tier = gmData ? gmData.tier : 'NONE';
          const pointsAwarded = getPointsFromTier(tier);
          totalPoints += pointsAwarded;

          breakdown[gm] = {
            tier,
            points: pointsAwarded
          };
        }

        return {
          discordId: player.discordId || player.id,
          username: player.username || `Player_${player.id.substring(0, 4)}`,
          avatarUrl: player.avatarUrl || null,
          totalPoints,
          achievementTitle: getAchievementTitle(totalPoints),
          breakdown
        };
      });

      // Sort descending by totalPoints
      results.sort((a, b) => b.totalPoints - a.totalPoints);

      // Extract the top 10
      const top10 = results.slice(0, 10);

      return res.status(200).json({
        success: true,
        mode: 'overall',
        length: top10.length,
        leaderboard: top10
      });

    } else {
      // 2. Fetch and order the active INDIVIDUAL gamemode
      if (!VALID_GAMEMODES.has(normalizedMode)) {
        return res.status(400).json({
          error: `Bad Request: Invalid mode requested. Must be 'overall' or one of the valid gamemodes: ${Array.from(VALID_GAMEMODES).join(', ')}`
        });
      }

      const filteredPlayers = [];

      for (const player of allPlayersDocs) {
        const gmData = player.gamemodes && player.gamemodes[normalizedMode];
        if (gmData) {
          const tierWeight = gmData.tierWeight !== undefined ? Number(gmData.tierWeight) : 11;
          const points = gmData.points !== undefined ? Number(gmData.points) : 0;

          // Filter out unranked players (tierWeight OF 11 represents unranked/invalid, or tier is "NONE")
          if (tierWeight !== 11 && gmData.tier !== 'NONE') {
            filteredPlayers.push({
              discordId: player.discordId || player.id,
              username: player.username || `Player_${player.id.substring(0, 4)}`,
              avatarUrl: player.avatarUrl || null,
              tier: gmData.tier || 'NONE',
              points,
              tierWeight,
              updatedAt: gmData.updatedAt || null
            });
          }
        }
      }

      // Sort ascending by tierWeight (where 1 stands for HT1, which is the best rank),
      // and use Points as a descending tie-breaker.
      filteredPlayers.sort((a, b) => {
        if (a.tierWeight !== b.tierWeight) {
          return a.tierWeight - b.tierWeight; // Lower weight (closer to 1) is better
        }
        return b.points - a.points; // Higher points is better
      });

      // Slice the top 10
      const top10 = filteredPlayers.slice(0, 10);

      return res.status(200).json({
        success: true,
        mode: normalizedMode,
        length: top10.length,
        leaderboard: top10
      });
    }

  } catch (error) {
    console.error(`Error querying leaderboard with mode=${normalizedMode}:`, error);
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
}
