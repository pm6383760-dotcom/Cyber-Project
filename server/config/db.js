const mongoose = require('mongoose');

let isConnected = false;
let useMemoryStore = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/phishguard';
  
  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${mongoUri}`);
    
    // Set connection options with 4-second timeout to avoid long hangs
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000
    });

    isConnected = true;
    useMemoryStore = false;
    console.log(`[DB] ✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    useMemoryStore = true;
    console.warn(`[DB] ⚠️ MongoDB connection failed: ${error.message}`);
    console.warn(`[DB] 🛡️ Activating PhishGuard In-Memory / File Fallback Store. App will continue to function seamlessly!`);
  }
};

const getDbStatus = () => ({
  connected: isConnected,
  usingFallback: useMemoryStore,
  mode: isConnected ? 'MongoDB (Production / Atlas)' : 'In-Memory Resilient Store (Demo / Viva Mode)'
});

module.exports = { connectDB, getDbStatus };
