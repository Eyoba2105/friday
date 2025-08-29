import { useEffect, useState } from 'react';
import { ref, onValue, push, set, update, off } from 'firebase/database';
import { database } from '../config/firebase';
import { User, Room, Game } from '../types/game';

export const useFirebase = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from Telegram
  useEffect(() => {
    const initUser = async () => {
      try {
        // Get Telegram WebApp data
        const tg = (window as any).Telegram?.WebApp;
        if (tg && tg.initDataUnsafe?.user) {
          const telegramUser = tg.initDataUnsafe.user;
          const userId = telegramUser.id.toString();
          
          // Check if user exists in Firebase
          const userRef = ref(database, `users/${userId}`);
          onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
              setUser(userData);
            } else {
              // Create new user
              const newUser: User = {
                id: userId,
                username: telegramUser.username || telegramUser.first_name,
                balance: 50, // New user bonus
                totalWins: 0,
                totalGames: 0,
                createdAt: Date.now()
              };
              set(userRef, newUser);
              setUser(newUser);
            }
            setLoading(false);
          });
        } else {
          // Demo user for testing
          const demoUser: User = {
            id: 'demo_user',
            username: 'DemoPlayer',
            balance: 100,
            totalWins: 0,
            totalGames: 0,
            createdAt: Date.now()
          };
          setUser(demoUser);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        setLoading(false);
      }
    };

    initUser();
  }, []);

  return { user, loading };
};

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roomsRef = ref(database, 'rooms');
    
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const roomsData = snapshot.val();
      if (roomsData) {
        const roomsList = Object.values(roomsData) as Room[];
        setRooms(roomsList.filter(room => room.isActive));
      } else {
        setRooms([]);
      }
      setLoading(false);
    });

    return () => off(roomsRef, 'value', unsubscribe);
  }, []);

  return { rooms, loading };
};

export const useGame = (roomId: string) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    const gameRef = ref(database, `games/${roomId}`);
    
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const gameData = snapshot.val();
      setGame(gameData || null);
      setLoading(false);
    });

    return () => off(gameRef, 'value', unsubscribe);
  }, [roomId]);

  return { game, loading };
};

// Firebase operations
export const joinGame = async (roomId: string, user: User, cardId: number, betAmount: number) => {
  try {
    const gameRef = ref(database, `games/${roomId}`);
    const playerData = {
      userId: user.id,
      username: user.username,
      cardId,
      markedNumbers: [],
      hasBingo: false,
      betAmount,
      joinedAt: Date.now()
    };

    await update(gameRef, {
      [`players/${user.id}`]: playerData
    });

    // Deduct balance
    const userRef = ref(database, `users/${user.id}/balance`);
    await set(userRef, user.balance - betAmount);

    return true;
  } catch (error) {
    console.error('Error joining game:', error);
    return false;
  }
};

export const markNumber = async (roomId: string, userId: string, numbers: number[]) => {
  try {
    const markedRef = ref(database, `games/${roomId}/players/${userId}/markedNumbers`);
    await set(markedRef, numbers);
    return true;
  } catch (error) {
    console.error('Error marking numbers:', error);
    return false;
  }
};

export const callBingo = async (roomId: string, userId: string) => {
  try {
    const bingoRef = ref(database, `games/${roomId}/players/${userId}/hasBingo`);
    await set(bingoRef, true);
    return true;
  } catch (error) {
    console.error('Error calling bingo:', error);
    return false;
  }
};