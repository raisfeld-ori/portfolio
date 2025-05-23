'use client'

import React, { useState } from 'react'

type Color = 'white' | 'black'

export enum CharacterTypes {
  Pawn,
  Knight,
  Bishop,
  King,
  Queen,
  Rook // Changed from Tower
}

export interface Character {
  type: CharacterTypes
  color: Color
  hasMoved?: boolean // Useful for special moves like castling and pawn's first move
  enPassantTarget?: boolean // Flag for en passant capture
}

function isValidBoard(board: (Character | null)[]): boolean {
  return board.length === 64;
}

function getRow(index: number): number {
  return Math.floor(index / 8);
}

function getColumn(index: number): number {
  return index % 8;
}

function Move(piece: number, target: number, board: (Character | null)[]): (Character | null)[] | null {
  // Validate board
  if (!isValidBoard(board)) return null;
  
  // Ensure piece exists
  const currentPiece = board[piece];
  if (!currentPiece) return null;

  // Prevent moving to a square occupied by a piece of the same color
  const targetPiece = board[target];
  if (targetPiece && targetPiece.color === currentPiece.color) return null;

  const currentRow = getRow(piece);
  const currentCol = getColumn(piece);
  const targetRow = getRow(target);
  const targetCol = getColumn(target);

  const rowDiff = Math.abs(targetRow - currentRow);
  const colDiff = Math.abs(targetCol - currentCol);

  // Create a copy of the board to modify
  const newBoard = [...board];

  switch (currentPiece.type) {
    case CharacterTypes.Pawn:
      const direction = currentPiece.color === 'black' ? 1 : -1;
      const startRow = currentPiece.color === 'black' ? 1 : 6;
      const promotionRow = currentPiece.color === 'black' ? 7 : 0;

      if (currentCol === targetCol) {
        if (targetRow === currentRow + direction) {
          if (!targetPiece) {
            newBoard[target] = { ...currentPiece, hasMoved: true };
            newBoard[piece] = null;
            
            // Promotion check
            if (targetRow === promotionRow) {
              newBoard[target] = { 
                type: CharacterTypes.Queen, 
                color: currentPiece.color 
              };
            }
            return newBoard;
          }
          return null;
        }
        
        if (!currentPiece.hasMoved && 
            targetRow === currentRow + (2 * direction) && 
            currentRow === startRow) {
          const middleSquare = piece + (8 * direction);
          if (!board[middleSquare] && !targetPiece) {
            newBoard[target] = { 
              ...currentPiece, 
              hasMoved: true,
              enPassantTarget: true 
            };
            newBoard[piece] = null;
            return newBoard;
          }
          return null;
        }
      }
      
      if (Math.abs(currentCol - targetCol) === 1 && 
          targetRow === currentRow + direction) {
        // Normal capture
        if (targetPiece && targetPiece.color !== currentPiece.color) {
          newBoard[target] = { ...currentPiece, hasMoved: true };
          newBoard[piece] = null;
          
          // Promotion check
          if (targetRow === promotionRow) {
            newBoard[target] = { 
              type: CharacterTypes.Queen, 
              color: currentPiece.color 
            };
          }
          return newBoard;
        }
        
        // En passant capture
        const enPassantRow = currentPiece.color === 'black' ? 4 : 3;
        if (currentRow === enPassantRow) {
          const enPassantTarget = board[target - (8 * direction)];
          if (enPassantTarget && 
              enPassantTarget.type === CharacterTypes.Pawn && 
              enPassantTarget.color !== currentPiece.color && 
              enPassantTarget.enPassantTarget) {
            newBoard[target] = { ...currentPiece, hasMoved: true };
            newBoard[piece] = null;
            newBoard[target - (8 * direction)] = null; // Remove captured pawn
            return newBoard;
          }
        }
        
        return null;
      }
      
      return null;

    case CharacterTypes.Rook:
      if ((currentRow === targetRow || currentCol === targetCol) && 
          isPathClear(piece, target, board)) {
        newBoard[target] = { ...currentPiece, hasMoved: true };
        newBoard[piece] = null;
        return newBoard;
      }
      return null;

    case CharacterTypes.Knight:
      if ((rowDiff === 2 && colDiff === 1) || 
          (rowDiff === 1 && colDiff === 2)) {
        newBoard[target] = { ...currentPiece, hasMoved: true };
        newBoard[piece] = null;
        return newBoard;
      }
      return null;

    case CharacterTypes.Bishop:
      if (rowDiff === colDiff && isPathClear(piece, target, board)) {
        newBoard[target] = { ...currentPiece, hasMoved: true };
        newBoard[piece] = null;
        return newBoard;
      }
      return null;

    case CharacterTypes.Queen:
      if ((currentRow === targetRow || 
           currentCol === targetCol || 
           rowDiff === colDiff) && 
          isPathClear(piece, target, board)) {
        newBoard[target] = { ...currentPiece, hasMoved: true };
        newBoard[piece] = null;
        return newBoard;
      }
      return null;

    case CharacterTypes.King:
      // Normal one-square move
      if (rowDiff <= 1 && colDiff <= 1) {
        newBoard[target] = { ...currentPiece, hasMoved: true };
        newBoard[piece] = null;
        return newBoard;
      }
      
      // Castling logic
      if (!currentPiece.hasMoved && rowDiff === 0 && colDiff === 2) {
        // Determine castling direction (kingside or queenside)
        const isKingSide = targetCol > currentCol;
        const rookStartCol = isKingSide ? 7 : 0;
        const rookTargetCol = isKingSide ? 5 : 3;
        const rookStartIndex = currentRow * 8 + rookStartCol;
        const rookTargetIndex = currentRow * 8 + rookTargetCol;
        
        const rook = newBoard[rookStartIndex];
        
        // Validate rook
        if (!rook || 
            rook.type !== CharacterTypes.Rook || 
            rook.color !== currentPiece.color || 
            rook.hasMoved) {
          return null;
        }
        
        // Check path is clear between king and rook
        const start = Math.min(currentCol, rookStartCol);
        const end = Math.max(currentCol, rookStartCol);
        for (let col = start + 1; col < end; col++) {
          const checkIndex = currentRow * 8 + col;
          if (newBoard[checkIndex]) {
            return null;
          }
        }
        
        newBoard[target] = { ...currentPiece, hasMoved: true };
        newBoard[piece] = null;
        newBoard[rookTargetIndex] = { ...rook, hasMoved: true };
        newBoard[rookStartIndex] = null;
        
        return newBoard;
      }
      
      return null;

    default:
      return null;
  }
}

function isPathClear(start: number, end: number, board: (Character | null)[]): boolean {
  const startRow = getRow(start);
  const startCol = getColumn(start);
  const endRow = getRow(end);
  const endCol = getColumn(end);

  const rowStep = startRow === endRow ? 0 : (endRow > startRow ? 1 : -1);
  const colStep = startCol === endCol ? 0 : (endCol > startCol ? 1 : -1);

  let currentPos = start + (rowStep * 8) + colStep;

  while (currentPos !== end) {
    if (board[currentPos]) return false;
    currentPos += (rowStep * 8) + colStep;
  }

  return true;
}

export function initializeBoard(): (Character | null)[] {
  const board: (Character | null)[] = new Array(64).fill(null);
  
  // white pieces
  const whitePieces: CharacterTypes[] = [
    CharacterTypes.Rook, CharacterTypes.Knight, CharacterTypes.Bishop, 
    CharacterTypes.Queen, CharacterTypes.King, CharacterTypes.Bishop, 
    CharacterTypes.Knight, CharacterTypes.Rook
  ];
  
  // Place black pawns
  for (let i = 8; i < 16; i++) {
    board[i] = { type: CharacterTypes.Pawn, color: 'black' };
  }
  
  // Place black back row
  whitePieces.forEach((type, index) => {
    board[index] = { type, color: 'black' };
  });

  // black pieces
  const blackPieces: CharacterTypes[] = [
    CharacterTypes.Rook, CharacterTypes.Knight, CharacterTypes.Bishop, 
    CharacterTypes.King, CharacterTypes.Queen, CharacterTypes.Bishop, 
    CharacterTypes.Knight, CharacterTypes.Rook
  ];
  
  // Place black pawns
  for (let i = 48; i < 56; i++) {
    board[i] = { type: CharacterTypes.Pawn, color: 'white' };
  }
  
  // Place black back row
  blackPieces.forEach((type, index) => {
    board[index + 56] = { type, color: 'white' };
  });

  return board;
}

// Enhanced pawn movement function for additional game logic
export function handlePawnMove(board: (Character | null)[], start: number, target: number): (Character | null)[] {
  const newBoard = [...board];
  const piece = newBoard[start];
  
  if (!piece || piece.type !== CharacterTypes.Pawn) return newBoard;

  const direction = piece.color === 'black' ? 1 : -1;
  const promotionRow = piece.color === 'black' ? 7 : 0;

  // Handle en passant capture
  if (Math.abs(getColumn(start) - getColumn(target)) === 1 && 
      !newBoard[target]) {
    const enPassantCaptureSquare = target - (8 * direction);
    newBoard[enPassantCaptureSquare] = null;
  }

  // Move the piece
  newBoard[target] = { 
    ...piece, 
    hasMoved: true,
    enPassantTarget: Math.abs(target - start) === 16 // Two square move
  };
  newBoard[start] = null;

  // Promotion
  if (getRow(target) === promotionRow) {
    newBoard[target] = { 
      type: CharacterTypes.Queen, 
      color: piece.color 
    };
  }

  return newBoard;
}

function getCharacterSymbol(character: Character): string {
  switch (character.type) {
    case CharacterTypes.Pawn:
      return 'https://uxwing.com/wp-content/themes/uxwing/download/sport-and-awards/chess-pawn-icon.png'
    case CharacterTypes.Knight:
      return 'https://uxwing.com/wp-content/themes/uxwing/download/sport-and-awards/chess-game-knight-icon.png'
    case CharacterTypes.Bishop:
      return 'https://uxwing.com/wp-content/themes/uxwing/download/sport-and-awards/chess-bishop-icon.png'
    case CharacterTypes.King:
      return 'https://uxwing.com/wp-content/themes/uxwing/download/sport-and-awards/crown-icon.png'
    case CharacterTypes.Queen:
      return 'https://uxwing.com/wp-content/themes/uxwing/download/sport-and-awards/crown-jewel-icon.png'
    case CharacterTypes.Rook:
      return 'https://uxwing.com/wp-content/themes/uxwing/download/sport-and-awards/chess-rook-icon.png'
    default:
      return ''
  }
}

export default function ChessBoard() {
  const [turn, setTurn] = useState<Color>('white')
  const [board, setBoard] = useState<(Character | null)[]>(initializeBoard())
  const [winner, setWinner] = useState<string | undefined>()
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)
  const handlePieceClick = (index: number) => {
    if (selectedPiece === null) {
      if (board[index] && board[index]?.color === turn) {
        setSelectedPiece(index)
      }
    } else {
      let newBoard = Move(selectedPiece, index, board);
      if (!newBoard){setSelectedPiece(null);return;}
      setBoard(newBoard);
      if (newBoard.filter((piece) => piece?.type === CharacterTypes.King).length === 1) {
        setWinner(newBoard.filter((piece) => piece?.type === CharacterTypes.King)[0]?.color)
      }
      setTurn(turn === 'white' ? 'black' : 'white')
      setSelectedPiece(null)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>{winner ? `Winner: ${winner}` : `Turn: ${turn}`}</div>
      <h1 className="text-4xl font-bold mb-8">Chess Game</h1>
      <div className={"p-8 rounded-lg shadow-lg " + (winner ? 'blur-lg pointer-events-none' : '')}>
        <div className="grid grid-cols-8 gap-1">
          {board.map((piece, index) => (
            <div
              key={index}
              className={`w-8 h-8 md:w-16 md:h-16 flex items-center font-extrabold justify-center text-4xl cursor-default select-none
                ${(Math.floor(index / 8) + index) % 2 === 0 ? 'bg-zinc-500 hover:bg-zinc-300' : 'bg-zinc-700 hover:bg-zinc-200'}
                ${selectedPiece === index ? 'ring-4 ring-blue-500' : ''}
                `}
              onClick={() => handlePieceClick(index)}
            >
              {piece && <img className={'w-full h-full md:w-1/2 md:h-1/2 ' + (piece.color === 'white' ? 'invert' : '')}
              src={getCharacterSymbol(piece)}></img>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

