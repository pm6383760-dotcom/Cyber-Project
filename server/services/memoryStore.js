const bcrypt = require('bcryptjs');

// In-memory collection fallback for bulletproof viva/offline presentation
const users = [];
const scans = [];

// Seed a default demo user so viva examiners can log in with 1 click
(async () => {
  const hashedPassword = await bcrypt.hash('Demo@1234', 10);
  users.push({
    _id: 'user_demo_001',
    name: 'Security Analyst (Demo)',
    email: 'analyst@phishguard.ai',
    password: hashedPassword,
    role: 'analyst',
    createdAt: new Date()
  });
})();

module.exports = {
  users,
  scans
};
