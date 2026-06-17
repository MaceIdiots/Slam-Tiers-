import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue, Firestore } from 'firebase-admin/firestore';

// Initialize Express
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Firebase Admin safely with the specified live credentials
let db: Firestore | null = null;

try {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || "slam-tiers-leaderboard";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@slam-tiers-leaderboard.iam.gserviceaccount.com";
    
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCpAHvneoiq1a0R\nejzOuNCWi1jgGXInTkLzI0spsE8zp8KR/jxM+8tMow1kdnP8mZB8tUgGQPT/jlON\nwWOgb/AMm7AV6/yJl5yWHQOEpsgAnw3cs4O7QjZcjaPAEz7VOoDlzt0Jla+8mTXL\nDP2qFpAUuIgVAToZ6aRhsXPor6zK0hU+vig1zfhZjaUF65ealwa53SoeVxTj3bgW\nqeIurkiZUTujs3l8srjwPVVfN/votcRmykCxmIlYWpSacSj7HgkloqFR4+hpqDRZ\nxToFmNjv6reAyq24Nz7+R39YbUFcoDTpYx46w43j5OFS0r2qTBhbUTgCR7N5c7Jg\nY+rzRLzRAgMBAAECgf9FN0asbk50KUGtNs6Z5PebZ43BKGGoacLhzR4ZSXWUa4fH\nGjIvFWfwdHK3uXmVPVjbTNqVEIoihQXclF7JT+qVY+4zefokICiogCvS/QTfKfw8\nk1JZoat45bd7NYs2YEZ4IaNqUGHCcQaChUixQwfWdLQ0+GTRITj4wNcjbr19Eznj\n23Tmpcg3EVTXfpDNz9HLZUgzCcXEahxPCZPRj50OZVHP8yHHQYT1cp9C99tRDjUi\nEqxG7h/JeZPL2JtnAi2L2z38p/pBt+RPI5RsQjOgsRCU7SvccaaLOGoRRPy2ar62\nCDbav2x2knbxHMwmlApKpbK5u0Mdp4DCtxMAEKECgYEA3YpO3E+2qPTyNHtvWDzi\nnHG7XKM3oPN6R8rvdZba/IOzpuKEUZ/MF5EtWmlDaum2horjgTKPAeFl0bYzrhkT\n5TAP4AcdC30RuYXLtWYS4suPgtzU/HelGC6N1f0tWonGXVRE4I7yGXWMRaBtnEL8\nvNgBcXn51EhHVsV4qWbAuWECgYEAw0obkMR13lhlLJ1PXnGwidm7zwlfTxeWHgWQ\nBG8zXLcWxDqWCUl//MdTc2Aes2Ym7KaGfnY3ymJf5E2c9hRmPx6KDNHnMTLUVb6D\nb5ZkJoLLLmRePR4xoqUM41FtPloM2W2X+zIihsXzG7ec/KjnsGpfTO+toG5witBt\n3z++iXECgYBrMuG1+VyJpP0OKCxYph2BVgczbEceurIQy0HTxItyZMgpmLIuTQSU\n4srvVMAqm6yWrd4oRi6s2kRKlb+sHrZh0D/eR5LmXD6XZwaLYDkDRTzMNc9Z2wso\nCF7ZjQjFJqW1w3EQuBqt9xNJHbfsRP3G4z7PihY5gkAC3MrmLbJUAQKBgBM51ITo\nEoKVSUCfLBUsNCkeGnNDhPKQa+MAwTDukavrCn6/Fc5MQiFsrjaJm/wlbmeV7V+9\n27g8/xvG2FERqQ9FvmmMsKoTSvw2CVKPB8US01X54504v8I3ZZFrjsm4q9MsCu5b\n/TIvgsOTzAzDxCuGDWPRpNJKjSHdazOzXtrBAoGBAMUBQsbu4QMLDTEXuVOx0OW6\niwPYTiB+KknkdxLId62McLtWelvOpkTAHYd8P+OHp0K8ajYuEjaerd9nbHcoQBTp\ndmsx3S5cnS1AAWV5xd1gTRWlpvBwcilIR/fbhCYHzm9+7RXedgzGBsKJJYE5D7JS\n9+0vvgtYoheKrZcZxUk0\n-----END PRIVATE KEY-----\n";
    
    const privateKey = rawPrivateKey.replace(/\\n/g, '\n');
    
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  db = getFirestore();
} catch (firebaseErr: any) {
  console.error("Firebase admin initialization failed:", firebaseErr);
}

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

// Static points mapped from tiers for calculating the Overall Leaderboard
const TIER_POINTS: Record<string, number> = {
  'HT1': 60, 'LT1': 40,
  'HT2': 30, 'LT2': 25,
  'HT3': 20, 'LT3': 15,
  'HT4': 12, 'LT4': 8,
  'HT5': 5,  'LT5': 2,
};

function getPointsFromTier(tier?: string): number {
  if (!tier) return 0;
  const normalized = String(tier).trim().toUpperCase();
  return TIER_POINTS[normalized] || 0;
}

function getAchievementTitle(points: number): string {
  if (points >= 400) return '👑 Combat Grandmaster';
  if (points >= 250) return '⚔️ Combat Master';
  if (points >= 100) return '💎 Combat Ace';
  if (points >= 50) return '🔥 Combat Specialist';
  if (points >= 20) return '🛡️ Combat Cadet';
  if (points >= 10) return '🎯 Combat Novice';
  return '🪵 Rookie';
}

// 1. POST route for Discord bot promotion & specific gamemode role updates
const TIER_WEIGHTS: Record<string, number> = {
  'HT1': 1, 'LT1': 2,
  'HT2': 3, 'LT2': 4,
  'HT3': 5, 'LT3': 6,
  'HT4': 7, 'LT4': 8,
  'HT5': 9, 'LT5': 10,
};

function getTierWeightFromTier(tier?: string): number {
  if (!tier) return 11;
  const normalized = String(tier).trim().toUpperCase();
  return TIER_WEIGHTS[normalized] !== undefined ? TIER_WEIGHTS[normalized] : 11;
}

const ROLES_POST_PATHS = [
  '/api/promote',
  '/api/tierrolemace',
  '/api/tierrolesword',
  '/api/tierrolesmp',
  '/api/tierrolenethpot',
  '/api/tierrolediapot',
  '/api/tierrolebuilduhc',
  '/api/tierroleaxe',
  '/api/tierrolecrystal'
];

app.post(ROLES_POST_PATHS, async (req, res) => {
  // Verify Bearer token authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
  }

  const token = authHeader.substring(7);
  const secret = process.env.INTERNAL_API_SECRET || "A@V>Wr]qs~_,?6E#*L9)2=4dXxc4PNdE";

  if (token !== secret) {
    return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
  }

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
    console.log(`[Identity Mapping] Mapping linked identity for "${finalUsername}" (ID: "${finalDiscordId}") to canonical PlanetLord entry.`);
    finalDiscordId = 'planetlord_linked_id';
    finalUsername = 'PlanetLord';
  }

  if (!finalDiscordId) {
    console.warn(`[Ambiguous Payload Flagged] Route ${req.path}: Missing discordId in request`);
    return res.status(400).json({ 
      success: false, 
      error: 'Ambiguous Data Flagged: Missing required parameter "discordId". Please review payload.' 
    });
  }

  let finalGamemode = gamemode ? String(gamemode).trim().toLowerCase() : '';
  if (!finalGamemode) {
    const pathLowers = req.path.toLowerCase();
    for (const validGm of VALID_GAMEMODES) {
      if (pathLowers.includes(validGm)) {
        finalGamemode = validGm;
        break;
      }
    }
  }

  if (!finalGamemode || !VALID_GAMEMODES.has(finalGamemode)) {
    console.warn(`[Ambiguous Payload Flagged] Route ${req.path}: Invalid/missing gamemode "${finalGamemode}" for player ${finalUsername}`);
    return res.status(400).json({
      success: false,
      error: `Ambiguous Data Flagged: Invalid or missing gamemode "${finalGamemode}". Must be one of: ${Array.from(VALID_GAMEMODES).join(', ')}`
    });
  }

  if (tier === undefined) {
    console.warn(`[Ambiguous Payload Flagged] Route ${req.path}: Missing tier payload for player ${finalUsername}`);
    return res.status(400).json({ 
      success: false, 
      error: 'Ambiguous Data Flagged: Missing required parameter "tier". Please specify a tier (e.g. HT1).' 
    });
  }

  const finalTier = String(tier).trim().toUpperCase();
  const calculatedWeight = getTierWeightFromTier(finalTier);

  if (calculatedWeight === 11) {
    console.warn(`[Ambiguous Payload Flagged] Route ${req.path}: Invalid tier "${finalTier}" received for player ${finalUsername}`);
    return res.status(400).json({
      success: false,
      error: `Ambiguous Data Flagged: Invalid tier "${finalTier}". Tiers must be between LT5 and HT1.`
    });
  }

  try {
    // Parse points or dynamically fall back to the schema tier weight hierarchy
    let numPoints = points !== undefined && points !== null ? Number(points) : getPointsFromTier(finalTier);
    if (isNaN(numPoints) || points === '') {
      numPoints = getPointsFromTier(finalTier);
    }

    if (!db) {
      return res.status(503).json({
        success: false,
        error: "Database service is currently unavailable. Please check configuration."
      });
    }

    const playerRef = db.collection('players').doc(String(finalDiscordId));
    const now = FieldValue.serverTimestamp();

    const gamemodeData = {
      tier: finalTier,
      points: numPoints,
      tierWeight: calculatedWeight,
      updatedAt: now
    };

    // Deep Merge (merge: true) to allow adding or updating specific gamemodes without clobbering others
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
      channelId: "1501282759983763487",
      message: `Successfully set gamemode ${finalGamemode} mapping and deep merged in Firestore.`
    });

  } catch (error: any) {
    console.error(`Error updating player document [${discordId}]:`, error);
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

// 2. GET route for single player search (case-insensitive username/id check)
app.get('/api/player', async (req, res) => {
  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Bad Request: Missing required query parameter "username"' });
  }

  const searchName = username.trim().toLowerCase();

  try {
    const HISTORICAL_ROSTER: any[] = [];

    const playerMap = new Map<string, any>();

    // Seed the map with HISTORICAL_ROSTER by merging modes
    for (const p of HISTORICAL_ROSTER) {
      if (!playerMap.has(p.id)) {
        playerMap.set(p.id, {
          id: p.id,
          discordId: p.id,
          username: p.id,
          avatarUrl: null,
          gamemodes: {}
        });
      }
      const existing = playerMap.get(p.id);
      existing.gamemodes[p.mode] = {
        tier: p.tier,
        points: p.points,
        tierWeight: p.weight,
        updatedAt: new Date()
      };
    }

    // Try to merge live database content
    try {
      if (db) {
        const playersSnapshot = await db.collection('players').get();
        if (!playersSnapshot.empty) {
          playersSnapshot.forEach(doc => {
            const docData = doc.data();
            const pId = doc.id;
            if (playerMap.has(pId)) {
              const existing = playerMap.get(pId);
              playerMap.set(pId, {
                ...existing,
                ...docData,
                gamemodes: {
                  ...existing.gamemodes,
                  ...(docData.gamemodes || {})
                }
              });
            } else {
              playerMap.set(pId, {
                id: pId,
                ...docData
              });
            }
          });
        }
      }
    } catch (dbError) {
      console.error("Firestore DB query failed during player search, using historical roster:", dbError);
    }

    const allPlayersDocs = Array.from(playerMap.values());
    const matchedPlayer = allPlayersDocs.find(p => {
      const pName = p.username?.trim().toLowerCase();
      const pId = p.id?.trim().toLowerCase();
      
      // Match linked identities (such as PlanetLord and blurr) to the same leaderboard entry
      if (searchName === 'blurr' || searchName === 'planetlord') {
        return pName === 'planetlord' || pId === 'planetlord_linked_id';
      }
      return pName === searchName || pId === searchName;
    });

    if (!matchedPlayer) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }

    // Also calculate overall points to show in search as well
    let calculatedOverallPoints = 0;
    const VALID_GAME_MODES_KEYS = ['mace', 'sword', 'diapot', 'nethpot', 'smp', 'builduhc', 'axe', 'crystal'];
    for (const gm of VALID_GAME_MODES_KEYS) {
      const gmData = matchedPlayer.gamemodes && matchedPlayer.gamemodes[gm];
      if (gmData) {
        const pts = gmData.points !== undefined ? Number(gmData.points) : getPointsFromTier(gmData.tier);
        calculatedOverallPoints += pts;
      }
    }

    matchedPlayer.overallPoints = calculatedOverallPoints;
    matchedPlayer.achievementTitle = getAchievementTitle(calculatedOverallPoints);

    return res.status(200).json({
      success: true,
      player: matchedPlayer
    });

  } catch (error: any) {
    console.error(`Error searching player [${username}]:`, error);
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

// 3. GET route for dynamic leaderboards
app.get('/api/leaderboard', async (req, res) => {
  const { mode } = req.query;

  if (!mode || typeof mode !== 'string') {
    return res.status(400).json({ error: 'Bad Request: Missing required query parameter "mode"' });
  }

  const normalizedMode = mode.trim().toLowerCase();

  try {
    const HISTORICAL_ROSTER: any[] = [];

    const playerMap = new Map<string, any>();

    // Seed the map with HISTORICAL_ROSTER by merging modes
    for (const p of HISTORICAL_ROSTER) {
      if (!playerMap.has(p.id)) {
        playerMap.set(p.id, {
          id: p.id,
          discordId: p.id,
          username: p.id,
          avatarUrl: null,
          gamemodes: {}
        });
      }
      const existing = playerMap.get(p.id);
      existing.gamemodes[p.mode] = {
        tier: p.tier,
        points: p.points,
        tierWeight: p.weight,
        updatedAt: new Date()
      };
    }

    // Attempt to merge live database content
    try {
      if (db) {
        const playersSnapshot = await db.collection('players').get();
        if (!playersSnapshot.empty) {
          playersSnapshot.forEach(doc => {
            const docData = doc.data();
            const pId = doc.id;
            if (playerMap.has(pId)) {
              const existing = playerMap.get(pId);
              playerMap.set(pId, {
                ...existing,
                ...docData,
                gamemodes: {
                  ...existing.gamemodes,
                  ...(docData.gamemodes || {})
                }
              });
            } else {
              playerMap.set(pId, {
                id: pId,
                ...docData
              });
            }
          });
        }
      }
    } catch (dbError) {
      console.error("Firestore DB query failed, falling back to local historical roster:", dbError);
    }

    const allPlayersDocs = Array.from(playerMap.values());

    if (normalizedMode === 'overall') {
      const results = allPlayersDocs.map(player => {
        let totalPoints = 0;
        const breakdown: Record<string, any> = {};

        for (const gm of VALID_GAMEMODES) {
          const gmData = player.gamemodes && player.gamemodes[gm];
          const pts = gmData ? (gmData.points !== undefined ? Number(gmData.points) : getPointsFromTier(gmData.tier)) : 0;
          totalPoints += pts;

          breakdown[gm] = {
            tier: gmData ? gmData.tier : 'NONE',
            points: pts
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

      // Sort descending by overall XP/points
      results.sort((a, b) => b.totalPoints - a.totalPoints);

      return res.status(200).json({
        success: true,
        mode: 'overall',
        length: results.length,
        leaderboard: results
      });

    } else {
      if (!VALID_GAMEMODES.has(normalizedMode)) {
        return res.status(400).json({
          error: `Bad Request: Invalid mode. Must be 'overall' or one of valid game modes.`
        });
      }

      const filteredPlayers: any[] = [];

      for (const player of allPlayersDocs) {
        const gmData = player.gamemodes && player.gamemodes[normalizedMode];
        if (gmData) {
          const tierWeight = gmData.tierWeight !== undefined ? Number(gmData.tierWeight) : 11;
          const points = gmData.points !== undefined ? Number(gmData.points) : 0;

          // Filter out unranked (tierWeight of 11, or tier is "NONE")
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

      // Absolute dual-sort sequence constraint:
      // Sort ascending by tierWeight (where 1/HT1 is top placement), then descending by points.
      filteredPlayers.sort((a, b) => {
        if (a.tierWeight !== b.tierWeight) {
          return a.tierWeight - b.tierWeight;
        }
        return b.points - a.points;
      });

      return res.status(200).json({
        success: true,
        mode: normalizedMode,
        length: filteredPlayers.length,
        leaderboard: filteredPlayers
      });
    }

  } catch (error: any) {
    console.error(`Error querying leaderboard with mode=${normalizedMode}:`, error);
    // Graceful fallback to avoid freezing the UI
    return res.status(200).json({
      success: true,
      mode: normalizedMode === 'overall' ? 'overall' : normalizedMode,
      length: 0,
      leaderboard: []
    });
  }
});

// Background cleanup task to purge historical/mock player datasets from live Firestore
async function cleanupMockPlayersFromDb() {
  const MOCK_IDS_TO_REMOVE = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13",
    "fagzy_noah", "adiaytz", "ElevenDragon_", "Vielaz", "Noob", "XenonBladez",
    "OnlyMortal", "RealMADDY_9157", "just._.shuffled", "Greeb", "DiabloSentex",
    "LamM2sz1uai", "Zorxk._", "Anish_CR7", "spawnquy1", "xadvancedTT",
    "Midnight_amura", "Void", "Kris_CS"
  ];

  try {
    if (!db) {
      console.log('Database cleanup skipped: Firebase not initialized.');
      return;
    }
    console.log('Running background database cleanup to completely target and remove legacy/mock player records...');
    const batch = db.batch();
    let count = 0;

    for (const id of MOCK_IDS_TO_REMOVE) {
      const docRef = db.collection('players').doc(id);
      batch.delete(docRef);
      count++;
    }

    // Also scan for any players whose username is "Knockbacc" (case-insensitive) or document ID is "Knockbacc"
    const playersSnapshot = await db.collection('players').get();
    playersSnapshot.forEach(doc => {
      const data = doc.data();
      const uName = (data.username || "").toLowerCase();
      const docId = doc.id.toLowerCase();
      if (uName === "knockbacc" || docId === "knockbacc") {
        batch.delete(doc.ref);
        count++;
      }
    });

    await batch.commit();
    console.log(`Database cleanup done. Purged ${count} specified mock/placeholder player doc refs.`);
  } catch (error) {
    console.error('Error during database cleanup execution:', error);
  }
}

// Configure Vite integration for serving frontend client on developer route
async function startServer() {
  // Clear any existing mock data asynchronously at boot to start with a clean slate
  cleanupMockPlayersFromDb().catch(err => {
    console.error('Database cleanup failure:', err);
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
