export interface User {
  id: string;
  username: string;
  balance: number;
  totalWins: number;
  totalGames: number;
  createdAt: number;
}

export interface Room {
  id: string;
  name: string;
  betAmount: number;
  maxPlayers: number;
  isActive: boolean;
  isDemo: boolean;
  currentGame?: Game;
  createdAt: number;
}

export interface Game {
  id: string;
  roomId: string;
  status: 'waiting' | 'countdown' | 'playing' | 'ended';
  drawnNumbers: number[];
  players: { [userId: string]: GamePlayer };
  startTime?: number;
  endTime?: number;
  countdownStartTime?: number;
  winner?: string;
}

export interface GamePlayer {
  userId: string;
  username: string;
  cardId: number;
  markedNumbers: number[];
  hasBingo: boolean;
  betAmount: number;
  joinedAt: number;
}

export interface BingoCard {
  id: number;
  numbers: {
    B: number[];
    I: number[];
    N: number[];
    G: number[];
    O: number[];
  };
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'bet' | 'win';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  details?: any;
  createdAt: number;
}

export type Language = 'en' | 'am';