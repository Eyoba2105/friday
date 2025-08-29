import React from 'react';
import { BingoCard as BingoCardType } from '../types/game';
import { hapticFeedback } from '../utils/telegram';

interface BingoCardProps {
  card: BingoCardType;
  markedNumbers: number[];
  drawnNumbers: number[];
  onNumberClick: (number: number) => void;
  disabled?: boolean;
}

export const BingoCard: React.FC<BingoCardProps> = ({
  card,
  markedNumbers,
  drawnNumbers,
  onNumberClick,
  disabled = false
}) => {
  const handleNumberClick = (number: number) => {
    if (!disabled && drawnNumbers.includes(number)) {
      hapticFeedback.light();
      onNumberClick(number);
    }
  };

  const renderColumn = (columnLetter: string, numbers: number[]) => (
    <div key={columnLetter} className="flex flex-col">
      <div className="bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold text-lg py-3 text-center rounded-t-lg">
        {columnLetter}
      </div>
      {numbers.map((number, index) => {
        const isDrawn = drawnNumbers.includes(number);
        const isMarked = markedNumbers.includes(number);
        const isCenter = columnLetter === 'N' && index === 2;
        
        return (
          <button
            key={number}
            onClick={() => handleNumberClick(number)}
            disabled={disabled || !isDrawn}
            className={`
              relative h-12 border border-gray-200 text-sm font-semibold transition-all duration-200
              ${isCenter ? 'bg-red-500 text-white' : ''}
              ${isMarked ? 'bg-green-500 text-white shadow-inner' : 'bg-white text-gray-800'}
              ${isDrawn && !isMarked && !isCenter ? 'bg-yellow-100 hover:bg-yellow-200 cursor-pointer' : ''}
              ${!isDrawn && !isCenter ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}
              ${isMarked ? 'animate-pulse' : ''}
            `}
          >
            {isCenter ? 'FREE' : number}
            {isMarked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white rounded-full bg-green-600" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 max-w-md mx-auto">
      <div className="grid grid-cols-5 gap-1 mb-4">
        {renderColumn('B', card.numbers.B)}
        {renderColumn('I', card.numbers.I)}
        {renderColumn('N', card.numbers.N)}
        {renderColumn('G', card.numbers.G)}
        {renderColumn('O', card.numbers.O)}
      </div>
      
      <div className="text-center">
        <div className="text-xs text-gray-500 mb-2">Card #{card.id}</div>
        <div className="text-sm text-gray-600">
          Marked: {markedNumbers.length}/24
        </div>
      </div>
    </div>
  );
};