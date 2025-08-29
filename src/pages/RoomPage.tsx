import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { GameStatus } from '../components/GameStatus';
import { BingoCard } from '../components/BingoCard';
import { DrawnNumbers } from '../components/DrawnNumbers';
import { CardSelector } from '../components/CardSelector';
import { useFirebase, useGame, joinGame, markNumber, callBingo } from '../hooks/useFirebase';
import { useLanguage } from '../contexts/LanguageContext';
import { getAvailableCards, bingoCards } from '../utils/bingoCards';
import { hapticFeedback } from '../utils/telegram';
import { BingoCard as BingoCardType } from '../types/game';

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useFirebase();
  const { game, loading } = useGame(roomId!);
  const { t } = useLanguage();

  const [selectedCard, setSelectedCard] = useState<BingoCardType | null>(null);
  const [markedNumbers, setMarkedNumbers] = useState<number[]>([]);
  const [hasJoined, setHasJoined] = useState(false);

  const currentPlayer = game?.players?.[user?.id || ''];
  const usedCardIds = game ? Object.values(game.players || {}).map(p => p.cardId) : [];
  const availableCards = getAvailableCards(usedCardIds);

  useEffect(() => {
    if (currentPlayer) {
      setHasJoined(true);
      const playerCard = bingoCards.find(card => card.id === currentPlayer.cardId);
      if (playerCard) {
        setSelectedCard(playerCard);
        setMarkedNumbers(currentPlayer.markedNumbers || []);
      }
    }
  }, [currentPlayer]);

  const handleJoinGame = async () => {
    if (!user || !selectedCard || !roomId) return;

    const success = await joinGame(roomId, user, selectedCard.id, roomId === 'demo' ? 0 : 10);
    if (success) {
      hapticFeedback.success();
      setHasJoined(true);
    } else {
      hapticFeedback.error();
    }
  };

  const handleNumberClick = async (number: number) => {
    if (!hasJoined || !user || !roomId) return;

    const newMarkedNumbers = markedNumbers.includes(number)
      ? markedNumbers.filter(n => n !== number)
      : [...markedNumbers, number];

    setMarkedNumbers(newMarkedNumbers);
    await markNumber(roomId, user.id, newMarkedNumbers);
  };

  const handleBingoCall = async () => {
    if (!hasJoined || !user || !roomId) return;
    
    hapticFeedback.heavy();
    await callBingo(roomId, user.id);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4">⟳</div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">{t('back')}</span>
          </button>
        </div>

        {game && <GameStatus game={game} />}

        {game?.drawnNumbers && game.drawnNumbers.length > 0 && (
          <DrawnNumbers 
            drawnNumbers={game.drawnNumbers}
            currentNumber={game.drawnNumbers[game.drawnNumbers.length - 1]}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {!hasJoined ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('selectCard')}</h3>
                
                <CardSelector
                  availableCards={availableCards}
                  selectedCard={selectedCard}
                  onCardSelect={setSelectedCard}
                />
                
                <button
                  onClick={handleJoinGame}
                  disabled={!selectedCard}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-6 rounded-lg hover:from-green-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles size={20} />
                    <span>{t('joinGame')}</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('yourCard')}</h3>
                
                {game?.status === 'ended' && !currentPlayer?.hasBingo && (
                  <button
                    onClick={handleBingoCall}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 transform hover:-translate-y-0.5 animate-pulse mb-4"
                  >
                    {t('callBingo')}
                  </button>
                )}
                
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    {t('markedNumbers')}: {markedNumbers.length}/24
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            {selectedCard && (
              <BingoCard
                card={selectedCard}
                markedNumbers={markedNumbers}
                drawnNumbers={game?.drawnNumbers || []}
                onNumberClick={handleNumberClick}
                disabled={!hasJoined || game?.status !== 'playing'}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};