import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Download, Play, Upload, X } from 'lucide-react';

interface GalleryScreenProps {
  onBack: () => void;
  currentTheme: string;
}

const GalleryScreen: React.FC<GalleryScreenProps> = ({ onBack, currentTheme }) => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printedPhotos, setPrintedPhotos] = useState<string[]>([]);
  const [showPrintedPhotos, setShowPrintedPhotos] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customPhotos, setCustomPhotos] = useState<{url: string, date: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultPhotos = [
    {
      url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: '20/04/25'
    },
    {
      url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: '21/04/25'
    },
    {
      url: 'https://images.pexels.com/photos/1130623/pexels-photo-1130623.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: '22/04/25'
    },
    {
      url: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=400',
      date: '23/04/25'
    }
  ];

  const photos = customPhotos.length > 0 ? customPhotos : defaultPhotos;

  const getThemeColors = () => {
    switch (currentTheme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          border: 'border-gray-600',
          screen: 'bg-gray-800',
          text: 'text-gray-100'
        };
      case 'retro':
        return {
          bg: 'bg-orange-900',
          border: 'border-orange-400',
          screen: 'bg-red-900',
          text: 'text-orange-100'
        };
      case 'neon':
        return {
          bg: 'bg-purple-900',
          border: 'border-cyan-400',
          screen: 'bg-pink-900',
          text: 'text-cyan-100'
        };
      default:
        return {
          bg: 'bg-gray-800',
          border: 'border-yellow-400',
          screen: 'bg-green-900',
          text: 'text-green-400'
        };
    }
  };

  const themeColors = getThemeColors();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos: {url: string, date: string}[] = [];
      
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const today = new Date();
            const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear().toString().slice(-2)}`;
            
            newPhotos.push({
              url: e.target.result as string,
              date: dateStr
            });
            
            if (newPhotos.length === files.length) {
              setCustomPhotos(prev => [...prev, ...newPhotos]);
              setCurrentPhoto(0);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddPhotoUrl = () => {
    const url = prompt('Masukkan URL foto:');
    if (url) {
      const today = new Date();
      const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear().toString().slice(-2)}`;
      
      setCustomPhotos(prev => [...prev, { url, date: dateStr }]);
    }
  };

  const handleResetPhotos = () => {
    setCustomPhotos([]);
    setCurrentPhoto(0);
    setPrintedPhotos([]);
    setShowPrintedPhotos(false);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    
    // Simulate printing all photos one by one
    const printPhotos = async () => {
      const newPrintedPhotos: string[] = [];
      
      for (let i = 0; i < photos.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        newPrintedPhotos.push(photos[i].url);
        setPrintedPhotos([...newPrintedPhotos]);
      }
      
      setIsPrinting(false);
      setShowPrintedPhotos(true);
    };
    
    printPhotos();
  };

  const handleNext = () => {
    if (showPrintedPhotos) {
      // Reset and go back to gallery view
      setShowPrintedPhotos(false);
      setPrintedPhotos([]);
    } else {
      // Continue to next step or show printed photos
      setShowPrintedPhotos(true);
    }
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
          <div className="text-yellow-400 font-bold">HEYTML PHOTOBOX</div>
          <button
            onClick={() => setShowCustomization(!showCustomization)}
            className="text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Panel */}
        {showCustomization && (
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="text-yellow-400 font-bold mb-3 text-center">📸 Customize Photos</div>
            <div className="space-y-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload dari Device</span>
              </button>
              <button
                onClick={handleAddPhotoUrl}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
              >
                Tambah URL Foto
              </button>
              <button
                onClick={handleResetPhotos}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Reset ke Default</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {!showPrintedPhotos ? (
          <>
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="bg-white rounded-lg p-4 min-h-60 flex items-center justify-center relative overflow-hidden">
                {isPrinting && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <div>Mencetak foto {printedPhotos.length + 1} dari {photos.length}... ({Math.round(((printedPhotos.length + 1) / photos.length) * 100)}%)</div>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <img
                    src={photos[currentPhoto].url}
                    alt={`Photo ${currentPhoto + 1}`}
                    className="max-w-full max-h-full object-contain rounded"
                  />
                  
                  {/* Photo frame with date */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                    {photos[currentPhoto].date}
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4">
                  <Play className="text-black w-8 h-8 bg-white rounded-full p-1 shadow-lg" />
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setCurrentPhoto(prev => Math.max(0, prev - 1))}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={currentPhoto === 0}
                >
                  ←
                </button>
                <span className="text-white px-4 py-2">
                  {currentPhoto + 1} / {photos.length}
                </span>
                <button
                  onClick={() => setCurrentPhoto(prev => Math.min(photos.length - 1, prev + 1))}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={currentPhoto === photos.length - 1}
                >
                  →
                </button>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>{isPrinting ? 'MENCETAK...' : 'CETAK'}</span>
              </button>
              <button 
                onClick={handleNext}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
              >
                SELANJUTNYA
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Printed Photos Display */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6 max-h-96 overflow-y-auto">
              <div className="text-yellow-400 font-bold mb-4 text-center">
                📸 Foto Tercetak ({printedPhotos.length}/{photos.length})
              </div>
              
              <div className="space-y-4">
                {printedPhotos.map((photoUrl, index) => (
                  <div key={index} className="bg-white rounded-lg p-2 shadow-lg transform transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      <img
                        src={photoUrl}
                        alt={`Printed Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                        #{index + 1} - {photos[index]?.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {printedPhotos.length === photos.length && (
                <div className="text-center mt-4 text-green-400 font-bold animate-bounce">
                  ✅ Semua foto berhasil dicetak!
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowPrintedPhotos(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
              >
                KEMBALI KE GALERI
              </button>
              <button 
                onClick={onBack}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105"
              >
                SELESAI
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GalleryScreen;