import React, { useState, useEffect } from 'react';
import { Power } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';
import GameBoy from './components/GameBoy';
import MessageScreen from './components/MessageScreen';
import GalleryScreen from './components/GalleryScreen';
import MusicPlayer from './components/MusicPlayer';
import TetrisGame from './components/TetrisGame';

type Screen = 'loading' | 'menu' | 'message' | 'gallery' | 'music' | 'tetris';
type Theme = 'classic' | 'dark' | 'retro' | 'neon';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<Theme>('classic');
  const [isPoweredOn, setIsPoweredOn] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadingComplete = () => {
    setCurrentScreen('menu');
  };

  const handleMenuSelect = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleThemeChange = () => {
    const themes: Theme[] = ['classic', 'dark', 'retro', 'neon'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setCurrentTheme(themes[nextIndex]);
  };

  const handlePowerToggle = () => {
    setIsPoweredOn(!isPoweredOn);
  };

  const getThemeClasses = () => {
    switch (currentTheme) {
      case 'dark':
        return 'from-gray-900 via-gray-800 to-black';
      case 'retro':
        return 'from-orange-900 via-red-900 to-pink-900';
      case 'neon':
        return 'from-cyan-900 via-purple-900 to-pink-900';
      default:
        return 'from-purple-900 via-blue-900 to-indigo-900';
    }
  };

  const renderScreen = () => {
    if (!isPoweredOn) {
      return (
        <div className="w-full max-w-md mx-auto bg-gray-200 p-6 rounded-2xl shadow-2xl gameboy-body">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePowerToggle}
                className="text-red-500 w-4 h-4 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Power className="w-4 h-4" />
              </button>
              <span className="text-gray-700 text-xs">POWER</span>
            </div>
            <div className="text-gray-700 font-bold text-sm">HEYTML-BOY</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg mb-6 screen-border">
            <div className="bg-black p-6 rounded h-48 flex items-center justify-center">
              <div className="text-gray-600 text-center">
                <div className="text-xs">POWER OFF</div>
                <div className="text-xs mt-2">Press Power to Turn On</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6 opacity-50">
            <div className="bg-gray-400 text-gray-600 py-3 px-4 rounded-lg font-bold text-center">MESSAGE</div>
            <div className="bg-gray-400 text-gray-600 py-3 px-4 rounded-lg font-bold text-center">GALLERY</div>
            <div className="bg-gray-400 text-gray-600 py-3 px-4 rounded-lg font-bold text-center">MUSIC</div>
            <div className="bg-gray-400 text-gray-600 py-3 px-4 rounded-lg font-bold text-center">TETRIS</div>
          </div>
          
          <div className="flex justify-between items-center opacity-50">
            <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-8 mt-6 opacity-50">
            <div className="px-4 py-2 bg-gray-600 rounded-full text-xs">SELECT</div>
            <div className="px-4 py-2 bg-gray-600 rounded-full text-xs">START</div>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'loading':
        return <LoadingScreen onComplete={handleLoadingComplete} />;
      case 'menu':
        return <GameBoy onMenuSelect={handleMenuSelect} onThemeChange={handleThemeChange} onPowerToggle={handlePowerToggle} currentTheme={currentTheme} />;
      case 'message':
        return <MessageScreen onBack={handleBackToMenu} currentTheme={currentTheme} />;
      case 'gallery':
        return <GalleryScreen onBack={handleBackToMenu} currentTheme={currentTheme} />;
      case 'music':
        return <MusicPlayer onBack={handleBackToMenu} currentTheme={currentTheme} />;
      case 'tetris':
        return <TetrisGame onBack={handleBackToMenu} currentTheme={currentTheme} />;
      default:
        return <GameBoy onMenuSelect={handleMenuSelect} onThemeChange={handleThemeChange} onPowerToggle={handlePowerToggle} currentTheme={currentTheme} />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getThemeClasses()} flex items-center justify-center p-4 transition-all duration-1000`}>
      <div className="w-full max-w-md mx-auto">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;