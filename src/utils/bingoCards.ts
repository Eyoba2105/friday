import { BingoCard } from '../types/game';

// Generate 100 unique bingo cards
export const generateBingoCards = (): BingoCard[] => {
  const cards: BingoCard[] = [];
  
  for (let cardId = 1; cardId <= 100; cardId++) {
    const card: BingoCard = {
      id: cardId,
      numbers: {
        B: generateUniqueNumbers(1, 15, 5),
        I: generateUniqueNumbers(16, 30, 5),
        N: generateUniqueNumbers(31, 45, 5),
        G: generateUniqueNumbers(46, 60, 5),
        O: generateUniqueNumbers(61, 75, 5)
      }
    };
    cards.push(card);
  }
  
  return cards;
};

function generateUniqueNumbers(min: number, max: number, count: number): number[] {
  const numbers = [];
  const available = [];
  
  for (let i = min; i <= max; i++) {
    available.push(i);
  }
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    numbers.push(available.splice(randomIndex, 1)[0]);
  }
  
  return numbers.sort((a, b) => a - b);
}

export const bingoCards = generateBingoCards();

export const getAvailableCards = (usedCardIds: number[]): BingoCard[] => {
  return bingoCards.filter(card => !usedCardIds.includes(card.id));
};

export const validateBingo = (card: BingoCard, markedNumbers: number[], drawnNumbers: number[]): boolean => {
  const cardNumbers = [
    ...card.numbers.B,
    ...card.numbers.I,
    ...card.numbers.N,
    ...card.numbers.G,
    ...card.numbers.O
  ];
  
  // Check if all marked numbers are valid (on the card and drawn)
  const validMarked = markedNumbers.every(num => 
    cardNumbers.includes(num) && drawnNumbers.includes(num)
  );
  
  if (!validMarked) return false;
  
  // Check for winning patterns (full card bingo)
  const allColumns = Object.values(card.numbers);
  let markedCount = 0;
  
  for (const column of allColumns) {
    for (const number of column) {
      if (markedNumbers.includes(number)) {
        markedCount++;
      }
    }
  }
  
  // Need at least 24 marked numbers for a valid bingo (center is free)
  return markedCount >= 24;
};

export const generateGameNumbers = (): number[] => {
  const numbers = [];
  for (let i = 1; i <= 75; i++) {
    numbers.push(i);
  }
  
  // Shuffle and return first 25 numbers
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  
  return numbers.slice(0, 25);
};