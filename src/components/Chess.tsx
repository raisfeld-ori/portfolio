'use client'

import React, { useState } from 'react'

type Color = 'black' | 'white'

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

function canMove(piece: number, target: number, board: (Character | null)[]): boolean {
  // Validate board
  if (!isValidBoard(board)) return false;
  
  // Ensure piece exists
  const currentPiece = board[piece];
  if (!currentPiece) return false;

  // Prevent moving to a square occupied by a piece of the same color
  const targetPiece = board[target];
  if (targetPiece && targetPiece.color === currentPiece.color) return false;

  const currentRow = getRow(piece);
  const currentCol = getColumn(piece);
  const targetRow = getRow(target);
  const targetCol = getColumn(target);

  const rowDiff = Math.abs(targetRow - currentRow);
  const colDiff = Math.abs(targetCol - currentCol);

  switch (currentPiece.type) {
    case CharacterTypes.Pawn:
      const direction = currentPiece.color === 'white' ? 1 : -1;
      const startRow = currentPiece.color === 'white' ? 1 : 6;
      const promotionRow = currentPiece.color === 'white' ? 7 : 0;

      // Standard forward move
      if (currentCol === targetCol) {
        // Single square move
        if (targetRow === currentRow + direction) {
          return !targetPiece; // Can only move to empty square
        }
        
        // First move can be two squares
        if (!currentPiece.hasMoved && 
            targetRow === currentRow + (2 * direction) && 
            currentRow === startRow) {
          const middleSquare = piece + (8 * direction);
          return !board[middleSquare] && !targetPiece;
        }
      }
      
      // Capture diagonally
      if (Math.abs(currentCol - targetCol) === 1 && 
          targetRow === currentRow + direction) {
        // Normal capture
        if (targetPiece && targetPiece.color !== currentPiece.color) {
          return true;
        }
        
        // En passant capture
        const enPassantRow = currentPiece.color === 'white' ? 4 : 3;
        if (currentRow === enPassantRow) {
          const enPassantTarget = board[target - (8 * direction)];
          if (enPassantTarget && 
              enPassantTarget.type === CharacterTypes.Pawn && 
              enPassantTarget.color !== currentPiece.color && 
              enPassantTarget.enPassantTarget) {
            return true;
          }
        }
        
        return false;
      }
      
      return false;

    case CharacterTypes.Rook:
      // Move along rows or columns
      return (currentRow === targetRow || currentCol === targetCol) && 
             isPathClear(piece, target, board);

    case CharacterTypes.Knight:
      // Classic L-shaped move: 2 squares in one direction, 1 in perpendicular
      return (rowDiff === 2 && colDiff === 1) || 
             (rowDiff === 1 && colDiff === 2);

    case CharacterTypes.Bishop:
      // Diagonal move
      return rowDiff === colDiff && isPathClear(piece, target, board);

    case CharacterTypes.Queen:
      // Combines Rook and Bishop movements
      return (currentRow === targetRow || 
              currentCol === targetCol || 
              rowDiff === colDiff) && 
             isPathClear(piece, target, board);

    case CharacterTypes.King:
      // Move one square in any direction
      // TODO: Add castling logic
      return rowDiff <= 1 && colDiff <= 1;

    default:
      return false;
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
  
  // White pieces
  const whitePieces: CharacterTypes[] = [
    CharacterTypes.Rook, CharacterTypes.Knight, CharacterTypes.Bishop, 
    CharacterTypes.Queen, CharacterTypes.King, CharacterTypes.Bishop, 
    CharacterTypes.Knight, CharacterTypes.Rook
  ];
  
  // Place white pawns
  for (let i = 8; i < 16; i++) {
    board[i] = { type: CharacterTypes.Pawn, color: 'white' };
  }
  
  // Place white back row
  whitePieces.forEach((type, index) => {
    board[index] = { type, color: 'white' };
  });

  // Black pieces
  const blackPieces: CharacterTypes[] = [
    CharacterTypes.Rook, CharacterTypes.Knight, CharacterTypes.Bishop, 
    CharacterTypes.King, CharacterTypes.Queen, CharacterTypes.Bishop, 
    CharacterTypes.Knight, CharacterTypes.Rook
  ];
  
  // Place black pawns
  for (let i = 48; i < 56; i++) {
    board[i] = { type: CharacterTypes.Pawn, color: 'black' };
  }
  
  // Place black back row
  blackPieces.forEach((type, index) => {
    board[index + 56] = { type, color: 'black' };
  });

  return board;
}

// Enhanced pawn movement function for additional game logic
export function handlePawnMove(board: (Character | null)[], start: number, target: number): (Character | null)[] {
  const newBoard = [...board];
  const piece = newBoard[start];
  
  if (!piece || piece.type !== CharacterTypes.Pawn) return newBoard;

  const direction = piece.color === 'white' ? 1 : -1;
  const promotionRow = piece.color === 'white' ? 7 : 0;

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
      return '♙'
    case CharacterTypes.Knight:
      return '♞'
    case CharacterTypes.Bishop:
      return '♝'
    case CharacterTypes.King:
      return '♚'
    case CharacterTypes.Queen:
      return '♛'
    case CharacterTypes.Rook:
      return '♜'
    default:
      return ''
  }
}

export default function ChessBoard() {
  const [turn, setTurn] = useState<Color>('white')
  const [board, setBoard] = useState<(Character | null)[]>(initializeBoard())
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)

  const handlePieceClick = (index: number) => {
    if (selectedPiece === null) {
      if (board[index] && board[index]?.color === turn) {
        setSelectedPiece(index)
      }
    } else {
      let movement = canMove(selectedPiece, index, board);
      if (!movement){setSelectedPiece(null);return;}
      setBoard((prevBoard) => {
        let newBoard = [...prevBoard]
        newBoard[index] = newBoard[selectedPiece]
        newBoard[selectedPiece] = null
        return newBoard
      })
      setTurn(turn === 'white' ? 'black' : 'white')
      setSelectedPiece(null)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Chess Game</h1>
      <div className="p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-8 gap-1">
          {board.map((piece, index) => (
            <div
              key={index}
              className={`w-16 h-16 flex items-center font-extrabold justify-center text-4xl cursor-default select-none
                ${(Math.floor(index / 8) + index) % 2 === 0 ? 'bg-zinc-500 hover:bg-zinc-400' : 'bg-zinc-700 hover:bg-zinc-500'}
                ${selectedPiece === index ? 'ring-4 ring-blue-500' : ''}
                ${piece?.color === 'black' ? 'text-black' : 'text-white'}`}
              onClick={() => handlePieceClick(index)}
            >
              {piece && getCharacterSymbol(piece)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

