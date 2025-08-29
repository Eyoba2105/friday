import React, { useEffect, useState } from 'react';
import { Clock, Trophy, Users } from 'lucide-react';
import { Game } from '../types/game';
import { useLanguage } from '../contexts/LanguageContext';

interface GameStatusProps {
  game: Game;
}

export const GameStatus: React.FC<GameStatusProps> = ({ game }) => {
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (game.status === 'countdown' && game.countdownStartTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - game.countdownStartTime!;
        const remaining = Math.max(0, 30 - Math.floor(elapsed / 1000));
        setCountdown(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [game.status, game.countdownStartTime]);

  const playerCount = Object.keys(game.players || {}).length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{t('gameStatus')}</h2>
        <div className="flex items-center space-x-2 text-blue-600">
          <Users size={18} />
          <span className="font-semibold">{playerCount}</span>
        </div>
      </div>

      {game.status === 'waiting' && (
        <div className="text-center py-8">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">{t('waitingForPlayers')}</p>
          <p className="text-sm text-gray-500 mt-2">
            {playerCount < 2 ? `Need ${2 - playerCount} more player${2 - playerCount > 1 ? 's' : ''}` : 'Ready to start!'}
          </p>
        </div>
      )}

      {game.status === 'countdown' && (
        <div className="text-center py-8">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4">
              <div className="w-full h-full border-4 border-blue-200 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold animate-pulse">
                {countdown}
              </div>
            </div>
          </div>
          <p className="text-lg text-gray-700 font-semibold">
            {t('gameStartsIn')} {countdown} {t('seconds')}
          </p>
        </div>
      )}

      {game.status === 'playing' && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-spin">
            <div className="w-8 h-8 bg-white rounded-full" />
          </div>
          <p className="text-lg text-gray-700 font-semibold">Game in Progress</p>
          <p className="text-sm text-gray-500 mt-1">Numbers being drawn...</p>
        </div>
      )}

      {game.status === 'ended' && (
        <div className="text-center py-6">
          <Trophy className="w-16 h-16 text-gold-500 mx-auto mb-4" />
          <p className="text-lg text-gray-700 font-semibold">{t('gameEnded')}</p>
          {game.winner ? (
            <div className="mt-4 p-4 bg-gold-50 rounded-lg">
              <p className="text-gold-800 font-bold">
                {t('winner')}: {game.players[game.winner]?.username}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">{t('noWinner')}</p>
          )}
        </div>
      )}
    </div>
  );
};