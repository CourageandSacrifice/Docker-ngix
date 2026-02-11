const express = require('express');
const { Client } = require('pg');
const { createClient } = require('redis');

const app = express();

// Postgres connection
const pgClient = new Client({
  connectionString: process.env.DATABASE_URL
});

// Redis connection
const redisClient = createClient({
  url: process.env.REDIS_URL
});

async function start() {
  // Connect to Postgres
  await pgClient.connect();
  console.log('✅ Postgres connected');

  // Connect to Redis
  await redisClient.connect();
  console.log('✅ Redis connected');

  // Routes
  app.get('/api', (req, res) => {
    res.json({ message: 'Hello World API' });
  });

  app.get('/api/health', async (req, res) => {
    const pgResult = await pgClient.query('SELECT NOW()');
    const redisResult = await redisClient.ping();
    res.json({
      postgres: pgResult.rows[0],
      redis: redisResult
    });
  });

  app.listen(3000, () => {
    console.log('🚀 API running on port 3000');
  });
}

start().catch(console.error);