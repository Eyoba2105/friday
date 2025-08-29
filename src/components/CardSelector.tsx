import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BingoCard } from '../types/game';
import { useLanguage } from '../contexts/LanguageContext';
import { hapticFeedback } from '../utils/telegram';

interface CardSelectorProps {
  availableCards: BingoCard[];
  selectedCard: BingoCard | null;
  onCardSelect: (card: BingoCard) => void;
}

export const CardSelector: React.FC<CardSelectorProps> = ({
  availableCards,
  selectedCard,
  onCardSelect
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleCardSelect = (card: BingoCard) => {
    hapticFeedback.selection();
    onCardSelect(card);
    setIsOpen(false);
  };

  const previewCard = (card: BingoCard) => {
    const allNumbers = [
      ...card.numbers.B,
      ...card.numbers.I,
      ...card.numbers.N,
      ...card.numbers.G,
      ...card.numbers.O
    ];
    return allNumbers.slice(0, 8).join(', ') + '...';
  };

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-300 transition-colors"
      >
        <div className="text-left">
          <div className="font-semibold text-gray-800">
            {selectedCard ? `Card #${selectedCard.id}` : t('selectCard')}
          </div>
          {selectedCard && (
            <div className="text-sm text-gray-500 mt-1">
              {previewCard(selectedCard)}
            </div>
          )}
        </div>
        {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto">
          {availableCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardSelect(card)}
              className="w-full p-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-800">Card #{card.id}</div>
              <div className="text-sm text-gray-500 mt-1">{previewCard(card)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};