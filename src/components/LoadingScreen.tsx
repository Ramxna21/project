import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showReady, setShowReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setShowReady(true);
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      <div className="text-center space-y-8 animate-pulse">
        <div className="border-4 border-green-400 p-8 rounded-lg bg-black shadow-2xl shadow-green-400/50">
          <h1 className="text-green-400 text-4xl font-bold mb-6 tracking-wider pixel-font">
            HEYTML-BOY
          </h1>
          
          <div className="flex items-center justify-center mb-4">
            <Play className="text-white w-8 h-8 mr-2" />
            <span className="text-green-400 text-lg">READY!</span>
          </div>
          
          <div className="w-80 h-6 bg-gray-800 rounded-full overflow-hidden border-2 border-green-400 mb-4">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between text-green-400 text-sm mb-4">
            <span>{progress}%</span>
            <span>100%</span>
          </div>
          
          {showReady && (
            <div className="text-orange-400 text-xl font-bold animate-bounce">
              SMILE!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;