import React from 'react';
import { Users, Play, Eye } from 'lucide-react';
import { Room, User } from '../types/game';
import { useLanguage } from '../contexts/LanguageContext';
import { hapticFeedback } from '../utils/telegram';

interface RoomCardProps {
  room: Room;
  user: User;
  onJoin: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, user, onJoin }) => {
  const { t } = useLanguage();
  
  const canJoin = room.isDemo || user.balance >= room.betAmount;
  const currentPlayers = room.currentGame ? Object.keys(room.currentGame.players || {}).length : 0;
  
  const handleJoin = () => {
    hapticFeedback.selection();
    onJoin(room.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className={`h-2 ${room.isDemo ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-gold-400 to-yellow-600'}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{room.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {room.isDemo && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {t('free')}
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-800">
              {room.isDemo ? t('free') : `${room.betAmount} ${t('birr')}`}
            </div>
            <div className="text-xs text-gray-500">{t('betAmount')}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
              <Users size={16} />
              <span className="text-sm">{t('currentPlayers')}</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {currentPlayers}/{room.maxPlayers}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">{t('gameStatus')}</div>
            <div className={`text-sm font-medium px-2 py-1 rounded-full ${
              room.currentGame?.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
              room.currentGame?.status === 'playing' ? 'bg-blue-100 text-blue-800' :
              room.currentGame?.status === 'ended' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {room.currentGame?.status ? t(room.currentGame.status) : t('waiting')}
            </div>
          </div>
        </div>

        <button
          onClick={handleJoin}
          disabled={!canJoin && !room.isDemo}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            canJoin || room.isDemo
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canJoin || room.isDemo ? (
            <>
              <Play size={16} />
              <span>{t('joinGame')}</span>
            </>
          ) : (
            <>
              <Eye size={16} />
              <span>{t('spectateGame')}</span>
            </>
          )}
        </button>
        
        {!canJoin && !room.isDemo && (
          <p className="text-center text-red-500 text-xs mt-2">
            {t('insufficientBalance')}
          </p>
        )}
      </div>
    </div>
  );
};