import { Game, GamePlayer, Room, User } from '../types/game';
import { validateBingo, generateGameNumbers } from './bingoCards';
import { ref, update, set } from 'firebase/database';
import { database } from '../config/firebase';

export class GameEngine {
  private static instance: GameEngine;
  private activeGames: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  async createGame(room: Room): Promise<string> {
    const gameId = `${room.id}_${Date.now()}`;
    const game: Game = {
      id: gameId,
      roomId: room.id,
      status: 'waiting',
      drawnNumbers: [],
      players: {},
    };

    const gameRef = ref(database, `games/${room.id}`);
    await set(gameRef, game);
    
    return gameId;
  }

  async checkGameStart(roomId: string): Promise<void> {
    const game = await this.getGame(roomId);
    if (!game) return;

    const playerCount = Object.keys(game.players || {}).length;
    
    if (playerCount >= 2 && game.status === 'waiting') {
      await this.startCountdown(roomId);
    }
  }

  private async startCountdown(roomId: string): Promise<void> {
    const gameRef = ref(database, `games/${roomId}`);
    await update(gameRef, {
      status: 'countdown',
      countdownStartTime: Date.now()
    });

    // Start game after 30 seconds
    const timeout = setTimeout(async () => {
      await this.startGame(roomId);
    }, 30000);

    this.activeGames.set(roomId, timeout);
  }

  private async startGame(roomId: string): Promise<void> {
    const gameRef = ref(database, `games/${roomId}`);
    const drawnNumbers = generateGameNumbers();
    
    await update(gameRef, {
      status: 'playing',
      startTime: Date.now(),
      drawnNumbers: []
    });

    // Draw numbers one by one
    for (let i = 0; i < drawnNumbers.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds between numbers
      
      const currentNumbers = drawnNumbers.slice(0, i + 1);
      await update(gameRef, {
        drawnNumbers: currentNumbers
      });
    }

    // End game
    await this.endGame(roomId);
  }

  private async endGame(roomId: string): Promise<void> {
    const game = await this.getGame(roomId);
    if (!game) return;

    const gameRef = ref(database, `games/${roomId}`);
    await update(gameRef, {
      status: 'ended',
      endTime: Date.now()
    });

    // Check for winners and process payouts
    await this.processGameResults(roomId, game);
  }

  private async processGameResults(roomId: string, game: Game): Promise<void> {
    const players = Object.values(game.players || {});
    let winner: GamePlayer | null = null;

    // Check for valid bingo calls
    for (const player of players) {
      if (player.hasBingo) {
        const card = bingoCards.find(c => c.id === player.cardId);
        if (card && validateBingo(card, player.markedNumbers, game.drawnNumbers)) {
          winner = player;
          break;
        }
      }
    }

    if (winner) {
      const totalPot = players.reduce((sum, p) => sum + p.betAmount, 0);
      const winnings = Math.floor(totalPot * 0.9); // 90% payout, 10% house edge
      
      // Update winner's balance
      const userRef = ref(database, `users/${winner.userId}`);
      await update(userRef, {
        [`balance`]: winnings,
        [`totalWins`]: 1 // This should be incremented, not set to 1
      });

      // Update game with winner
      const gameRef = ref(database, `games/${roomId}`);
      await update(gameRef, { winner: winner.userId });
    }

    // Reset game for next round after 10 seconds
    setTimeout(async () => {
      const gameRef = ref(database, `games/${roomId}`);
      await set(gameRef, {
        id: `${roomId}_${Date.now()}`,
        roomId,
        status: 'waiting',
        drawnNumbers: [],
        players: {},
      });
    }, 10000);
  }

  private async getGame(roomId: string): Promise<Game | null> {
    try {
      const gameRef = ref(database, `games/${roomId}`);
      const snapshot = await new Promise((resolve, reject) => {
        const unsubscribe = (gameRef as any).once('value', resolve, reject);
      });
      return (snapshot as any).val();
    } catch (error) {
      console.error('Error getting game:', error);
      return null;
    }
  }
}