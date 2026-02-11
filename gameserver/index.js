const { Server } = require('colyseus');
const { createServer } = require('http');
const { createClient } = require('redis');

// Simple room
const { Room } = require('colyseus');

class GameRoom extends Room {
  onCreate() {
    this.setState({ players: {}, message: 'Room created!' });
    console.log('🎮 GameRoom created');
  }

  onJoin(client) {
    console.log(`👤 ${client.sessionId} joined`);
    this.state.players[client.sessionId] = { x: 0, y: 0 };
  }

  onLeave(client) {
    console.log(`👋 ${client.sessionId} left`);
    delete this.state.players[client.sessionId];
  }
}

async function start() {
  // Connect to Redis
  const redisClient = createClient({ url: process.env.REDIS_URL });
  await redisClient.connect();
  console.log('✅ Redis connected');

  const httpServer = createServer();
  const gameServer = new Server({ server: httpServer });

  gameServer.define('game', GameRoom);

  httpServer.listen(2567, () => {
    console.log('🎮 Game server running on port 2567');
  });
}

start().catch(console.error);