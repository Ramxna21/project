import React, { useState } from 'react';
import { Power, Battery, Palette, Volume2 } from 'lucide-react';

interface GameBoyProps {
  onMenuSelect: (screen: 'message' | 'gallery' | 'music' | 'tetris') => void;
  onThemeChange: () => void;
  onPowerToggle: () => void;
  currentTheme: string;
}

const GameBoy: React.FC<GameBoyProps> = ({ onMenuSelect, onThemeChange, onPowerToggle, currentTheme }) => {
  const [selectedMenu, setSelectedMenu] = useState<number>(0);
  const [showThemeNotification, setShowThemeNotification] = useState(false);
  const [showSoundNotification, setShowSoundNotification] = useState(false);

  const menuItems = ['message', 'gallery', 'music', 'tetris'] as const;

  const getScreenTheme = () => {
    switch (currentTheme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          text: 'text-gray-100',
          accent: 'text-blue-400',
          border: 'border-gray-600'
        };
      case 'retro':
        return {
          bg: 'bg-orange-900',
          text: 'text-orange-100',
          accent: 'text-yellow-400',
          border: 'border-orange-400'
        };
      case 'neon':
        return {
          bg: 'bg-purple-900',
          text: 'text-cyan-100',
          accent: 'text-pink-400',
          border: 'border-cyan-400'
        };
      default:
        return {
          bg: 'bg-green-900',
          text: 'text-green-400',
          accent: 'text-yellow-400',
          border: 'border-green-400'
        };
    }
  };

  const screenTheme = getScreenTheme();

  const handleMenuClick = (menu: 'message' | 'gallery' | 'music' | 'tetris') => {
    const index = menuItems.indexOf(menu);
    setSelectedMenu(index);
    setTimeout(() => onMenuSelect(menu), 300);
  };

  const handleDPadNavigation = (direction: 'up' | 'down' | 'left' | 'right') => {
    let newIndex = selectedMenu;
    
    switch (direction) {
      case 'up':
        newIndex = selectedMenu < 2 ? selectedMenu + 2 : selectedMenu - 2;
        break;
      case 'down':
        newIndex = selectedMenu >= 2 ? selectedMenu - 2 : selectedMenu + 2;
        break;
      case 'left':
        newIndex = selectedMenu % 2 === 0 ? selectedMenu + 1 : selectedMenu - 1;
        break;
      case 'right':
        newIndex = selectedMenu % 2 === 0 ? selectedMenu + 1 : selectedMenu - 1;
        break;
    }
    
    setSelectedMenu(Math.max(0, Math.min(3, newIndex)));
  };

  const handleStartPress = () => {
    onMenuSelect(menuItems[selectedMenu]);
  };

  const handleSelectPress = () => {
    setShowSoundNotification(true);
    setTimeout(() => setShowSoundNotification(false), 2000);
  };

  const handleABPress = () => {
    onThemeChange();
    setShowThemeNotification(true);
    setTimeout(() => setShowThemeNotification(false), 2000);
  };

  return (
    <div className="bg-gray-200 p-6 rounded-2xl shadow-2xl w-full max-w-md mx-auto gameboy-body">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onPowerToggle}
            className="text-red-500 w-4 h-4 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Power className="w-4 h-4" />
          </button>
          <span className="text-gray-700 text-xs">POWER</span>
        </div>
        <div className="text-gray-700 font-bold text-sm">HEYTML-BOY</div>
      </div>

      {/* Screen */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 screen-border">
        <div className={`${screenTheme.bg} p-6 rounded h-48 flex flex-col justify-center items-center ${screenTheme.text} pixel-screen relative transition-all duration-500`}>
          {/* Theme Notification */}
          {showThemeNotification && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold animate-bounce">
              Theme: {currentTheme.toUpperCase()}
            </div>
          )}
          
          {/* Sound Notification */}
          {showSoundNotification && (
            <div className="absolute top-2 right-2 bg-blue-400 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
              SOUND ON
            </div>
          )}
          
          <div className="text-center space-y-4">
            <h2 className={`${screenTheme.text} text-xl font-bold`}>Happy Birthday!</h2>
            <p className={`${screenTheme.accent} text-sm`}>Press Start Button</p>
            <div className="text-xs text-gray-400">DOT MATRIX WITH STEREO SOUND</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-1">
            <Battery className="text-red-500 w-4 h-4" />
            <span className="text-gray-400 text-xs">BATTERY</span>
          </div>
        </div>
      </div>

      {/* Menu Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handleMenuClick('message')}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${
            selectedMenu === 0 ? 'ring-4 ring-yellow-400 scale-95' : ''
          }`}
        >
          MESSAGE
        </button>
        <button
          onClick={() => handleMenuClick('gallery')}
          className={`bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${
            selectedMenu === 1 ? 'ring-4 ring-yellow-400 scale-95' : ''
          }`}
        >
          GALLERY
        </button>
        <button
          onClick={() => handleMenuClick('music')}
          className={`bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${
            selectedMenu === 2 ? 'ring-4 ring-yellow-400 scale-95' : ''
          }`}
        >
          MUSIC
        </button>
        <button
          onClick={() => handleMenuClick('tetris')}
          className={`bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 ${
            selectedMenu === 3 ? 'ring-4 ring-yellow-400 scale-95' : ''
          }`}
        >
          TETRIS
        </button>
      </div>

      {/* D-Pad and Buttons */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center relative">
              {/* Up */}
              <button 
                onClick={() => handleDPadNavigation('up')}
                className="absolute -top-1 w-6 h-3 bg-gray-600 hover:bg-gray-500 rounded-t transition-colors"
              />
              {/* Down */}
              <button 
                onClick={() => handleDPadNavigation('down')}
                className="absolute -bottom-1 w-6 h-3 bg-gray-600 hover:bg-gray-500 rounded-b transition-colors"
              />
              {/* Left */}
              <button 
                onClick={() => handleDPadNavigation('left')}
                className="absolute -left-1 w-3 h-6 bg-gray-600 hover:bg-gray-500 rounded-l transition-colors"
              />
              {/* Right */}
              <button 
                onClick={() => handleDPadNavigation('right')}
                className="absolute -right-1 w-3 h-6 bg-gray-600 hover:bg-gray-500 rounded-r transition-colors"
              />
              {/* Center */}
              <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleABPress}
            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center font-bold text-white hover:bg-red-600 transition-colors cursor-pointer group"
          >
            <div className="text-center">
              <div>B</div>
              <Palette className="w-3 h-3 mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
          <button
            onClick={handleABPress}
            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center font-bold text-white hover:bg-red-600 transition-colors cursor-pointer group"
          >
            <div className="text-center">
              <div>A</div>
              <Palette className="w-3 h-3 mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        </div>
      </div>

      {/* Select/Start */}
      <div className="flex justify-center space-x-8 mt-6">
        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white text-xs font-bold cursor-pointer transition-colors group"
          onClick={handleSelectPress}
        >
          <div className="flex items-center space-x-1">
            <span>SELECT</span>
            <Volume2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
        <button
          onClick={handleStartPress}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white text-xs font-bold cursor-pointer transition-colors"
        >
          START
        </button>
      </div>
    </div>
  );
};

export default GameBoy;