import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Heart, Smile } from 'lucide-react';

interface MessageScreenProps {
  onBack: () => void;
  currentTheme: string;
}

const MessageScreen: React.FC<MessageScreenProps> = ({ onBack, currentTheme }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showEmotes, setShowEmotes] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  
  const fullMessage = `Hi Cel,

Happy Birthday! 🎉

Hari ini aku ingin mengucapkan
selamat ulang tahun untuk kamu.

Semoga di tahun yang baru ini
kamu selalu bahagia, sehat,
dan semua impianmu tercapai.

Terima kasih sudah menjadi
teman yang luar biasa! 💝

With love,
Your Friend ❤️`;

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          border: 'border-gray-600',
          screen: 'bg-gray-800',
          text: 'text-blue-300',
          accent: 'text-blue-400',
          button: 'bg-blue-500 hover:bg-blue-600'
        };
      case 'retro':
        return {
          bg: 'bg-orange-900',
          border: 'border-orange-400',
          screen: 'bg-red-900',
          text: 'text-yellow-300',
          accent: 'text-orange-300',
          button: 'bg-orange-500 hover:bg-orange-600'
        };
      case 'neon':
        return {
          bg: 'bg-purple-900',
          border: 'border-cyan-400',
          screen: 'bg-pink-900',
          text: 'text-pink-300',
          accent: 'text-cyan-300',
          button: 'bg-cyan-500 hover:bg-cyan-600'
        };
      default:
        return {
          bg: 'bg-gray-800',
          border: 'border-yellow-400',
          screen: 'bg-green-900',
          text: 'text-green-300',
          accent: 'text-yellow-300',
          button: 'bg-green-500 hover:bg-green-600'
        };
    }
  };

  const themeColors = getThemeColors();

  useEffect(() => {
    setShowMessage(true);
    const timer = setTimeout(() => {
      if (!isSkipped) {
        startTyping();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isSkipped]);

  const startTyping = () => {
    const interval = setInterval(() => {
      if (currentIndex < fullMessage.length) {
        setTypedText(prev => prev + fullMessage[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
        setShowEmotes(true);
      }
    }, 50);
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setTypedText(fullMessage);
    setCurrentIndex(fullMessage.length);
    setIsTypingComplete(true);
    setShowEmotes(true);
  };

  const handleNext = () => {
    onBack();
  };

  const handleEmoteClick = (emote: string) => {
    // Animasi emote atau efek khusus
    const emoteElement = document.createElement('div');
    emoteElement.textContent = emote;
    emoteElement.className = 'fixed text-4xl animate-bounce pointer-events-none z-50';
    emoteElement.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    emoteElement.style.top = Math.random() * (window.innerHeight - 50) + 'px';
    emoteElement.style.color = '#FFD700';
    emoteElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    document.body.appendChild(emoteElement);
    
    setTimeout(() => {
      if (document.body.contains(emoteElement)) {
        document.body.removeChild(emoteElement);
      }
    }, 2000);
  };

  const handleReplay = () => {
    setTypedText('');
    setCurrentIndex(0);
    setIsTypingComplete(false);
    setIsSkipped(false);
    setShowEmotes(false);
    setTimeout(startTyping, 500);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className={`w-full max-w-md ${themeColors.bg} rounded-2xl p-6 shadow-2xl transition-all duration-500`}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className={`flex items-center space-x-2 ${themeColors.text} hover:text-white transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className={`${themeColors.accent} font-bold`}>Message</div>
        </div>

        <div className={`${themeColors.screen} border-4 ${themeColors.border} rounded-lg p-6 min-h-80 relative overflow-hidden transition-all duration-500`}>
          <div className={`${themeColors.text} font-mono text-sm leading-relaxed whitespace-pre-wrap`}>
            {typedText}
            {!isTypingComplete && !isSkipped && (
              <span className={`animate-pulse ${themeColors.accent}`}>|</span>
            )}
          </div>
          
          {/* Emotes yang bisa diklik */}
          {showEmotes && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => handleEmoteClick('😊')}
                className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                title="Click me!"
              >
                😊
              </button>
              <button
                onClick={() => handleEmoteClick('👋')}
                className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                title="Wave!"
              >
                👋
              </button>
              <button
                onClick={() => handleEmoteClick('❤️')}
                className="text-2xl hover:scale-125 transition-transform cursor-pointer animate-pulse"
                title="Love!"
              >
                ❤️
              </button>
            </div>
          )}
          
          {/* Tombol Skip */}
          {!isTypingComplete && !isSkipped && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button 
                onClick={handleSkip}
                className={`${themeColors.button} text-white px-6 py-2 rounded-full font-bold transition-all duration-200 transform hover:scale-105`}
              >
                SKIP
              </button>
            </div>
          )}

          {/* Tombol Play untuk replay */}
          {isTypingComplete && (
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleReplay}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                title="Replay message"
              >
                <Play className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          {isTypingComplete && (
            <button 
              onClick={handleNext}
              className={`${themeColors.button} text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105`}
            >
              SELANJUTNYA
            </button>
          )}
          <button 
            onClick={onBack}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
          >
            KEMBALI
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageScreen;