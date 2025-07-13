import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCw, ArrowDown, ArrowUp } from 'lucide-react';

interface TetrisGameProps {
  onBack: () => void;
  currentTheme: string;
}

const TetrisGame: React.FC<TetrisGameProps> = ({ onBack, currentTheme }) => {
  const [board, setBoard] = useState<number[][]>(Array(20).fill(null).map(() => Array(10).fill(0)));
  const [currentPiece, setCurrentPiece] = useState<number[][]>([]);
  const [currentPosition, setCurrentPosition] = useState({ x: 4, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const tetrisPieces = [
    [[1, 1, 1, 1]], // I piece
    [[1, 1], [1, 1]], // O piece
    [[0, 1, 0], [1, 1, 1]], // T piece
    [[1, 0, 0], [1, 1, 1]], // L piece
    [[0, 0, 1], [1, 1, 1]], // J piece
    [[1, 1, 0], [0, 1, 1]], // S piece
    [[0, 1, 1], [1, 1, 0]], // Z piece
  ];

  const colors = [
    'bg-gray-800', // empty
    'bg-cyan-400', // I
    'bg-yellow-400', // O
    'bg-purple-400', // T
    'bg-orange-400', // L
    'bg-blue-400', // J
    'bg-green-400', // S
    'bg-red-400', // Z
  ];

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

  const spawnPiece = useCallback(() => {
    const pieceIndex = Math.floor(Math.random() * tetrisPieces.length);
    const piece = tetrisPieces[pieceIndex];
    setCurrentPiece(piece);
    setCurrentPosition({ x: Math.floor(10 / 2) - Math.floor(piece[0].length / 2), y: 0 });
  }, []);

  const isValidMove = useCallback((piece: number[][], x: number, y: number, board: number[][]) => {
    for (let py = 0; py < piece.length; py++) {
      for (let px = 0; px < piece[py].length; px++) {
        if (piece[py][px] !== 0) {
          const newX = x + px;
          const newY = y + py;
          
          if (newX < 0 || newX >= 10 || newY >= 20) return false;
          if (newY >= 0 && board[newY][newX] !== 0) return false;
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback(() => {
    const newBoard = [...board];
    currentPiece.forEach((row, py) => {
      row.forEach((cell, px) => {
        if (cell !== 0) {
          const y = currentPosition.y + py;
          const x = currentPosition.x + px;
          if (y >= 0) {
            newBoard[y][x] = cell;
          }
        }
      });
    });

    // Check for complete lines
    let linesCleared = 0;
    for (let y = 19; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(10).fill(0));
        linesCleared++;
        y++; // Check the same line again
      }
    }

    if (linesCleared > 0) {
      setScore(prev => prev + linesCleared * 100 * level);
      setLines(prev => prev + linesCleared);
      setLevel(prev => Math.floor(lines / 10) + 1);
    }

    setBoard(newBoard);
    spawnPiece();
  }, [board, currentPiece, currentPosition, level, lines, spawnPiece]);

  const movePiece = useCallback((dx: number, dy: number) => {
    const newX = currentPosition.x + dx;
    const newY = currentPosition.y + dy;
    
    if (isValidMove(currentPiece, newX, newY, board)) {
      setCurrentPosition({ x: newX, y: newY });
    } else if (dy > 0) {
      // Piece hit bottom, place it
      placePiece();
    }
  }, [currentPosition, currentPiece, board, isValidMove, placePiece]);

  const rotatePiece = useCallback(() => {
    const rotated = currentPiece[0].map((_, index) =>
      currentPiece.map(row => row[index]).reverse()
    );
    
    if (isValidMove(rotated, currentPosition.x, currentPosition.y, board)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, currentPosition, board, isValidMove]);

  const startGame = () => {
    setBoard(Array(20).fill(null).map(() => Array(10).fill(0)));
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameRunning(true);
    setGameOver(false);
    spawnPiece();
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece.length > 0) {
      currentPiece.forEach((row, py) => {
        row.forEach((cell, px) => {
          if (cell !== 0) {
            const y = currentPosition.y + py;
            const x = currentPosition.x + px;
            if (y >= 0 && y < 20 && x >= 0 && x < 10) {
              displayBoard[y][x] = cell;
            }
          }
        });
      });
    }

    return displayBoard;
  };

  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = setInterval(() => {
      movePiece(0, 1);
    }, Math.max(100, 1000 - (level - 1) * 100));

    return () => clearInterval(gameLoop);
  }, [gameRunning, level, movePiece]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning, movePiece, rotatePiece]);

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
          <div className="text-yellow-400 font-bold">TETRIS</div>
        </div>

        <div className={`${themeColors.screen} border-4 ${themeColors.border} rounded-lg p-4 transition-all duration-500`}>
          <div className="grid grid-cols-10 gap-0.5 mb-4">
            {renderBoard().map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className={`w-6 h-6 rounded-sm ${colors[cell]} border border-gray-600`}
                />
              ))
            )}
          </div>

          <div className="text-white text-sm mb-4">
            <div className="flex justify-between">
              <span>Score: {score}</span>
              <span>Level: {level}</span>
            </div>
            <div>Lines: {lines}</div>
          </div>

          {!gameRunning && !gameOver && (
            <button
              onClick={startGame}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded font-bold"
            >
              START GAME
            </button>
          )}

          {gameRunning && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => movePiece(-1, 0)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-bold"
              >
                ←
              </button>
              <button
                onClick={() => movePiece(1, 0)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-bold"
              >
                →
              </button>
              <button
                onClick={() => movePiece(0, 1)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded font-bold flex items-center justify-center"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={rotatePiece}
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded font-bold flex items-center justify-center"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;