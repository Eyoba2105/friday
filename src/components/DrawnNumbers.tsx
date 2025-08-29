import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface DrawnNumbersProps {
  drawnNumbers: number[];
  currentNumber?: number;
}

export const DrawnNumbers: React.FC<DrawnNumbersProps> = ({ drawnNumbers, currentNumber }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Drawn Numbers ({drawnNumbers.length}/25)
      </h3>
      
      {currentNumber && (
        <div className="text-center mb-6">
          <div className="inline-block">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold animate-bounce shadow-lg">
              {currentNumber}
            </div>
            <p className="text-sm text-gray-600 mt-2">{t('numberDrawn')}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-8 gap-2">
        {drawnNumbers.map((number, index) => (
          <div
            key={index}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300
              ${index === drawnNumbers.length - 1 && !currentNumber ? 
                'bg-gradient-to-br from-red-500 to-pink-600 text-white animate-pulse shadow-lg scale-110' : 
                'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  );
};