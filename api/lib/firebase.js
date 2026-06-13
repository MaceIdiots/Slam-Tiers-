import admin from 'firebase-admin';

let db;

if (!admin.apps.length) {
  // Use provided live credentials or process.env overrides
  const projectId = process.env.FIREBASE_PROJECT_ID || "slam-tiers-leaderboard";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@slam-tiers-leaderboard.iam.gserviceaccount.com";
  
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCpAHvneoiq1a0R\nejzOuNCWi1jgGXInTkLzI0spsE8zp8KR/jxM+8tMow1kdnP8mZB8tUgGQPT/jlON\nwWOgb/AMm7AV6/yJl5yWHQOEpsgAnw3cs4O7QjZcjaPAEz7VOoDlzt0Jla+8mTXL\nDP2qFpAUuIgVAToZ6aRhsXPor6zK0hU+vig1zfhZjaUF65ealwa53SoeVxTj3bgW\nqeIurkiZUTujs3l8srjwPVVfN/votcRmykCxmIlYWpSacSj7HgkloqFR4+hpqDRZ\nxToFmNjv6reAyq24Nz7+R39YbUFcoDTpYx46w43j5OFS0r2qTBhbUTgCR7N5c7Jg\nY+rzRLzRAgMBAAECgf9FN0asbk50KUGtNs6Z5PebZ43BKGGoacLhzR4ZSXWUa4fH\nGjIvFWfwdHK3uXmVPVjbTNqVEIoihQXclF7JT+qVY+4zefokICiogCvS/QTfKfw8\nk1JZoat45bd7NYs2YEZ4IaNqUGHCcQaChUixQwfWdLQ0+GTRITj4wNcjbr19Eznj\n23Tmpcg3EVTXfpDNz9HLZUgzCcXEahxPCZPRj50OZVHP8yHHQYT1cp9C99tRDjUi\nEqxG7h/JeZPL2JtnAi2L2z38p/pBt+RPI5RsQjOgsRCU7SvccaaLOGoRRPy2ar62\nCDbav2x2knbxHMwmlApKpbK5u0Mdp4DCtxMAEKECgYEA3YpO3E+2qPTyNHtvWDzi\nnHG7XKM3oPN6R8rvdZba/IOzpuKEUZ/MF5EtWmlDaum2horjgTKPAeFl0bYzrhkT\n5TAP4AcdC30RuYXLtWYS4suPgtzU/HelGC6N1f0tWonGXVRE4I7yGXWMRaBtnEL8\nvNgBcXn51EhHVsV4qWbAuWECgYEAw0obkMR13lhlLJ1PXnGwidm7zwlfTxeWHgWQ\nBG8zXLcWxDqWCUl//MdTc2Aes2Ym7KaGfnY3ymJf5E2c9hRmPx6KDNHnMTLUVb6D\nb5ZkJoLLLmRePR4xoqUM41FtPloM2W2X+zIihsXzG7ec/KjnsGpfTO+toG5witBt\n3z++iXECgYBrMuG1+VyJpP0OKCxYph2BVgczbEceurIQy0HTxItyZMgpmLIuTQSU\n4srvVMAqm6yWrd4oRi6s2kRKlb+sHrZh0D/eR5LmXD6XZwaLYDkDRTzMNc9Z2wso\nCF7ZjQjFJqW1w3EQuBqt9xNJHbfsRP3G4z7PihY5gkAC3MrmLbJUAQKBgBM51ITo\nEoKVSUCfLBUsNCkeGnNDhPKQa+MAwTDukavrCn6/Fc5MQiFsrjaJm/wlbmeV7V+9\n27g8/xvG2FERqQ9FvmmMsKoTSvw2CVKPB8US01X54504v8I3ZZFrjsm4q9MsCu5b\n/TIvgsOTzAzDxCuGDWPRpNJKjSHdazOzXtrBAoGBAMUBQsbu4QMLDTEXuVOx0OW6\niwPYTiB+KknkdxLId62McLtWelvOpkTAHYd8P+OHp0K8ajYuEjaerd9nbHcoQBTp\ndmsx3S5cnS1AAWV5xd1gTRWlpvBwcilIR/fbhCYHzm9+7RXedgzGBsKJJYE5D7JS\n9+0vvgtYoheKrZcZxUk0\n-----END PRIVATE KEY-----\n";

  const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
  console.log('Firebase Admin initialized with credentials.');
}

db = admin.firestore();

export { admin, db };
