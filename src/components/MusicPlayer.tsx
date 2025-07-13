import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, Upload, X, Plus, Music } from 'lucide-react';

interface MusicPlayerProps {
  onBack: () => void;
  currentTheme: string;
}

interface Track {
  title: string;
  artist: string;
  duration: string;
  image: string;
  url?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ onBack, currentTheme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [customPlaylist, setCustomPlaylist] = useState<Track[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const defaultPlaylist: Track[] = [
    { title: 'On Bended Knee', artist: 'Boyz II Men', duration: '5:29', image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Everything I Do', artist: 'Bryan Adams', duration: '4:52', image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Just the Two of Us', artist: 'Bill Withers', duration: '3:58', image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: "Nothing's Gonna Change My Love", artist: 'George Benson', duration: '4:23', image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'How Deep Is Your Love', artist: 'Bee Gees', duration: '3:55', image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  const playlist = customPlaylist.length > 0 ? customPlaylist : defaultPlaylist;

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !playlist[currentTrack].url) {
      // Simulate progress for demo tracks
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          setCurrentTime(Math.floor(newProgress * 3.29 / 100));
          return newProgress > 100 ? 0 : newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack, playlist]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('audio/')) {
          const audio = new Audio();
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              audio.src = e.target.result as string;
              audio.addEventListener('loadedmetadata', () => {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                const newTrack: Track = {
                  title: file.name.replace(/\.[^/.]+$/, ""),
                  artist: 'Local File',
                  duration: durationStr,
                  image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
                  url: e.target.result as string
                };
                setCustomPlaylist(prev => [...prev, newTrack]);
                if (customPlaylist.length === 0) {
                  setCurrentTrack(0);
                }
              });
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleAddYouTubeUrl = () => {
    const url = prompt('Masukkan URL YouTube atau Spotify:');
    if (url) {
      const title = prompt('Masukkan judul lagu:') || 'Unknown Title';
      const artist = prompt('Masukkan nama artist:') || 'Unknown Artist';
      
      const newTrack: Track = {
        title,
        artist,
        duration: '3:30',
        image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
        url
      };
      setCustomPlaylist(prev => [...prev, newTrack]);
      if (customPlaylist.length === 0) {
        setCurrentTrack(0);
      }
    }
  };

  const handleImageChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const newImage = e.target.result as string;
            if (customPlaylist.length > 0) {
              const updatedPlaylist = [...customPlaylist];
              updatedPlaylist[currentTrack] = {
                ...updatedPlaylist[currentTrack],
                image: newImage
              };
              setCustomPlaylist(updatedPlaylist);
            } else {
              // Update default playlist
              const updatedPlaylist = [...defaultPlaylist];
              updatedPlaylist[currentTrack] = {
                ...updatedPlaylist[currentTrack],
                image: newImage
              };
              setCustomPlaylist(updatedPlaylist);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleImageUrlChange = () => {
    const url = prompt('Masukkan URL gambar untuk lagu ini:');
    if (url) {
      if (customPlaylist.length > 0) {
        const updatedPlaylist = [...customPlaylist];
        updatedPlaylist[currentTrack] = {
          ...updatedPlaylist[currentTrack],
          image: url
        };
        setCustomPlaylist(updatedPlaylist);
      } else {
        // Update default playlist
        const updatedPlaylist = [...defaultPlaylist];
        updatedPlaylist[currentTrack] = {
          ...updatedPlaylist[currentTrack],
          image: url
        };
        setCustomPlaylist(updatedPlaylist);
      }
    }
  };

  const handleImageContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const choice = confirm('Pilih sumber gambar:\nOK = Upload dari device\nCancel = Input URL');
    if (choice) {
      handleImageChange();
    } else {
      handleImageUrlChange();
    }
  };

  const handleImageUploadOld = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          // setCustomAlbumImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrl = () => {
    const url = prompt('Masukkan URL gambar album:');
    if (url) {
      // setCustomAlbumImage(url);
    }
  };

  const handleResetPlaylist = () => {
    setCustomPlaylist([]);
    setCurrentTrack(0);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (playlist[currentTrack].url && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % playlist.length);
    setProgress(0);
    setCurrentTime(0);
  };

  const prevTrack = () => {
    setCurrentTrack(prev => prev === 0 ? playlist.length - 1 : prev - 1);
    setProgress(0);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <div className="text-yellow-400 font-bold">Music Player</div>
        </div>

        {/* Simplified Controls */}
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <div className="text-yellow-400 font-bold mb-3 text-center">🎵 Music Controls</div>
          <div className="flex space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-bold transition-colors text-sm"
            >
              + Audio
            </button>
            <button
              onClick={handleAddYouTubeUrl}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg font-bold transition-colors text-sm"
            >
              + URL
            </button>
            <button
              onClick={handleResetPlaylist}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg font-bold transition-colors text-sm"
            >
              Reset
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div className={`${themeColors.screen} border-4 ${themeColors.border} rounded-lg p-6 mb-6 transition-all duration-500`}>
          <div className="text-center mb-4">
            <div 
              className="relative cursor-pointer group"
              onClick={handleImageChange}
              onContextMenu={handleImageContextMenu}
              title="Klik untuk ubah gambar lagu ini"
            >
              <img
                src={playlist[currentTrack]?.image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={playlist[currentTrack]?.title || 'Album Cover'}
                className="w-32 h-24 mx-auto rounded mb-4 object-cover border-2 border-yellow-400 group-hover:border-yellow-300 transition-colors"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded transition-all duration-200 flex items-center justify-center">
                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Klik untuk ubah
                </span>
              </div>
            </div>
            <div className={`${themeColors.text} font-bold text-lg`}>{playlist[currentTrack]?.title || 'No Track'}</div>
            <div className="text-yellow-400 text-sm">{playlist[currentTrack]?.artist || 'Unknown Artist'}</div>
            {playlist[currentTrack]?.url && (
              <div className="text-green-400 text-xs mt-1">🎵 Audio File</div>
            )}
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-yellow-400 text-sm mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{playlist[currentTrack]?.duration || '0:00'}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={prevTrack}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            <button
              onClick={togglePlay}
              className="bg-white hover:bg-gray-200 text-black p-3 rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={nextTrack}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-yellow-400 font-bold mb-2 flex items-center">
            PLAYLIST: <span className="ml-2 text-sm">
              {customPlaylist.length > 0 ? 'Custom Playlist 🎵' : 'my fav songs 😊'}
            </span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {playlist.map((track, index) => (
              <div
                key={index}
                onClick={() => setCurrentTrack(index)}
                className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors ${
                  index === currentTrack ? 'bg-blue-600' : 'hover:bg-gray-600'
                }`}
              >
                <div className="text-white text-sm flex items-center">
                  <img 
                    src={track.image} 
                    alt={track.title}
                    className="w-8 h-8 rounded mr-2 object-cover"
                  />
                  <div>
                    <div className="font-semibold flex items-center">
                      {index + 1}. {track.title}
                      {track.url && <span className="ml-1 text-green-400">🎵</span>}
                    </div>
                    <div className="text-gray-300 text-xs">{track.artist}</div>
                  </div>
                </div>
                <div className="text-gray-400 text-xs">{track.duration}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hidden audio element for playing local files */}
        {playlist[currentTrack]?.url && (
          <audio
            ref={audioRef}
            src={playlist[currentTrack].url}
            onEnded={nextTrack}
            onTimeUpdate={(e) => {
              const audio = e.target as HTMLAudioElement;
              const progress = (audio.currentTime / audio.duration) * 100;
              setProgress(progress);
              setCurrentTime(Math.floor(audio.currentTime));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;