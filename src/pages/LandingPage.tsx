import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { RoomCard } from '../components/RoomCard';
import { useFirebase, useRooms } from '../hooks/useFirebase';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, loading: userLoading } = useFirebase();
  const { rooms, loading: roomsLoading } = useRooms();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleJoinRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  // Add demo room if not exists
  const demoRoom = {
    id: 'demo',
    name: t('demoRoom'),
    betAmount: 0,
    maxPlayers: 10,
    isActive: true,
    isDemo: true,
    createdAt: Date.now()
  };

  const allRooms = [demoRoom, ...rooms];

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('welcomeTitle')}</h2>
          <p className="text-lg text-gray-600">{t('welcomeSubtitle')}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('availableRooms')}</h3>
          
          {roomsLoading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">{t('loading')}</p>
            </div>
          ) : allRooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('noRooms')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  user={user!}
                  onJoin={handleJoinRoom}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};