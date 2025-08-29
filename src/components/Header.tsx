import React from 'react';
import { Globe, User, Coins } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { User as UserType } from '../types/game';

interface HeaderProps {
  user: UserType | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">FB</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Friday Bingo</h1>
              <p className="text-xs text-blue-100">BOLT4L</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                  <User size={16} />
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-green-500/20 rounded-lg px-3 py-2">
                  <Coins size={16} />
                  <span className="text-sm font-bold">{user.balance} {t('birr')}</span>
                </div>
              </>
            )}
            
            <button
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors"
            >
              <Globe size={16} />
              <span className="text-sm font-medium">
                {language === 'en' ? 'አማ' : 'EN'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};