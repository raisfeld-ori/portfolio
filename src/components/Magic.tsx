'use client'

import { useEffect, useState } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurer, shapes, croodles, croodlesNeutral, funEmoji, adventurerNeutral, avataaars, avataaarsNeutral, openPeeps, bottts, botttsNeutral } from '@dicebear/collection';
import Image from 'next/image';

export enum UniqueAbility {
  Fireball = "Fireball",
  Heal = "Heal",
  Shield = "Shield",
  Poison = "Poison",
  Bomber = "Bomber",
  ManaBoost = "Mana Boost",
}

function useUniqueAbility(card: MagicCard, currentPlayer: Player, opponent: Player): [Player, Player] {
  let newCurrentPlayer = { ...currentPlayer };
  let newOpponent = { ...opponent };
  let ability = card.uniqueAbility;

  switch (ability) {
    case UniqueAbility.Fireball:
      newOpponent.health -= 5;
      break;
    case UniqueAbility.Heal:
      newCurrentPlayer.health += 5;
      break;
    case UniqueAbility.Shield:
      // Shield Stops the next attack
      newCurrentPlayer.shield = true;
      break;
    case UniqueAbility.Poison:
      // Poison reduces opponent's health gradually over turns
      newOpponent.poisonCounter = (newOpponent.poisonCounter || 0) + 3; // 3 turns poison effect
      break;
    case UniqueAbility.Bomber:
      // Clones the current card
      newCurrentPlayer.activeCards = []
      newOpponent.activeCards = []
      break;
    case UniqueAbility.ManaBoost:
      // Mana increses damage
      newCurrentPlayer.mana = (newCurrentPlayer.mana || 0) + 4;
      break;
    default:
      throw new Error('Unknown ability');
  }
  return [newCurrentPlayer, newOpponent];
}


export interface Player {
  deck: MagicCard[];
  health: number;
  pfp: string;
  name: string;
  shield?: boolean;
  poisonCounter?: number;
  mana?: number;
  activeCards: MagicCard[];
}

export interface MagicCard {
  name: string;
  image: string;
  damage: number;
  health: number;
  realHealth: number;
  uniqueAbility: UniqueAbility;
}


export function makeCharacter() {
  const styles = [
    () => createAvatar(adventurer),
    () => createAvatar(adventurerNeutral),
    () => createAvatar(avataaars),
    () => createAvatar(avataaarsNeutral),
    () => createAvatar(openPeeps),
    () => createAvatar(bottts),
    () => createAvatar(botttsNeutral),
    () => createAvatar(croodles),
    () => createAvatar(croodlesNeutral),
    () => createAvatar(funEmoji),
    () => createAvatar(shapes),
  ]
  return styles[Math.floor(Math.random() * styles.length)]().toDataUri();
}

// Adding more cards to the allCards array
const allCards: MagicCard[] = [
  {
    name: "Tio",
    image: makeCharacter(),
    damage: 7,
    realHealth: 3,
    health: 3,
    uniqueAbility: UniqueAbility.Fireball,
  },
  {
    name: "Aviv",
    image: makeCharacter(),
    damage: 0,
    realHealth: 10,
    health: 10,
    uniqueAbility: UniqueAbility.Poison,
  },
  {
    name: "Ariel",
    image: makeCharacter(),
    damage: 3,
    realHealth: 8,
    health: 8,
    uniqueAbility: UniqueAbility.Shield,
  },
  {
    name: "Ori",
    image: makeCharacter(),
    damage: 5,
    realHealth: 10,
    health: 10,
    uniqueAbility: UniqueAbility.ManaBoost,
  },
  {
    name: "Tal",
    image: makeCharacter(),
    damage: 0,
    realHealth: 20,
    health: 20,
    uniqueAbility: UniqueAbility.Bomber,
  },
  {
    name: "Yoshihara",
    image: makeCharacter(),
    damage: 5,
    realHealth: 5,
    health: 5,
    uniqueAbility: UniqueAbility.ManaBoost,
  },
  {
    name: "Iran",
    image: makeCharacter(),
    damage: 3,
    realHealth: 2,
    health: 2,
    uniqueAbility: UniqueAbility.Fireball,
  },
  {
    name: "Eshel",
    image: makeCharacter(),
    damage: 3,
    realHealth: 7,
    health: 7,
    uniqueAbility: UniqueAbility.Heal,
  },
  {
    name: "Amos",
    image: makeCharacter(),
    damage: 2,
    realHealth: 10,
    health: 10,
    uniqueAbility: UniqueAbility.Shield,
  },
  {
    name: "Toxic Alchemist",
    image: makeCharacter(),
    damage: 4,
    realHealth: 3,
    health: 3,
    uniqueAbility: UniqueAbility.Poison,
  },
  {
    name: "Dual-Blade Warrior",
    image: makeCharacter(),
    damage: 6,
    realHealth: 5,
    health: 5,
    uniqueAbility: UniqueAbility.Poison,
  },
  {
    name: "Mana Spirit",
    image: makeCharacter(),
    damage: 3,
    realHealth: 4,
    health: 4,
    uniqueAbility: UniqueAbility.ManaBoost,
  },
  {
    name: "Gurdian Angel",
    image: makeCharacter(),
    damage: 0,
    realHealth: 13,
    health: 13,
    uniqueAbility: UniqueAbility.Heal,
  }
];


const makeDeck = (deckCards: number): MagicCard[] => {
  return Array.from({ length: deckCards }, () => (allCards[Math.floor(Math.random() * allCards.length)]));
}

const Card = ({ card, className, handleSelect } : { card: MagicCard, className?: string, handleSelect?: () => void }) => {
  return (
    <div className={"w-48 rounded-xl overflow-hidden shadow-xl m-1 " + className} onClick={() => {if (handleSelect){handleSelect()}}}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{card.name}</h2>
        <div className="relative h-20 mb-4">
          <Image
            src={card.image}
            alt={card.name}
            layout="fill"
            objectFit="fill"
            className="rounded-lg"
          />
        </div>
        <div className='flex flex-row justify-center'>
          <p className='ml-3 mr-3 select-none'>❤️ - {card.health}</p>
          <p className='mr-3 ml-3 select-none'>⚔️ - {card.damage}</p>
        </div>
        <p className='select-none'>Unique Ability: {card.uniqueAbility}</p>
      </div>
    </div>
  );
};
export function PlayerZone({ player, isTurn, onChoiceAction }: { player: Player, isTurn: boolean, onChoiceAction: (card: MagicCard) => void }) {
  return (
    <div className="w-full max-w-md mx-auto shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 ">
        <div className="flex items-center space-x-4">
          <Image
            src={player.pfp}
            alt={`${player.name}'s avatar`}
            width={64}
            height={64}
            className="rounded-full"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{player.name} ({player.shield && '🛡️'}{player.poisonCounter && player.poisonCounter != 0 && ('🤢')}{player.mana && player.mana != 0 && '🌟'})</h2>
            <div className="flex items-center space-x-2">
              <div className="w-full bg-gray-300 rounded-full h-2.5">
                <div 
                  className={"bg-green-600 h-2.5 rounded-full " + (player.mana && player.mana != 0 && 'bg-blue-500')}
                  style={{ width: `${player.health + (player.mana || 0)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{player.health} HP</span>
              {player.mana && player.mana != 0 && <span className="text-sm font-medium">{player.mana} Mana</span>}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{player.activeCards.length > 0 && 'Active Cards'}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {player.activeCards.length > 0 && player.activeCards.map((card, index) => (
            <Card card={card} key={index} className={isTurn ? 'cursor-pointer' : ''} handleSelect={() => {if (isTurn){onChoiceAction(card)}}}></Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DeadPlayerZone({ player, isTurn, onChoiceAction }: { player: Player, isTurn: boolean, onChoiceAction: (card: MagicCard) => void }) {
  return (
    <div className="w-full max-w-md mx-auto shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 ">
        <div className="flex items-center space-x-4">
          {player.health > 0 ? <Image
            src={player.pfp}
            alt={`${player.name}'s avatar`}
            width={64}
            height={64}
            className="rounded-full"
          /> : <p className='text-4xl rounded-full'>💀</p>}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{player.name} ({player.shield && '🛡️'}{player.poisonCounter && player.poisonCounter != 0 && ('🤢+' + player.poisonCounter)})</h2>
            <div className="flex items-center space-x-2">
              <div className="w-full bg-gray-300 rounded-full h-2.5">
                <div 
                  className={"bg-green-600 h-2.5 rounded-full " + (player.mana ? 'bg-blue-500' : '')}
                  style={{ width: `${player.health + (player.mana || 0)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{player.health} HP {player.mana ? `+ ${player.mana}` : ''}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{player.activeCards.length > 0 && 'Active Cards'}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {player.activeCards.length > 0 && player.activeCards.map((card, index) => (
            <Card card={card} key={index} className={isTurn ? 'cursor-pointer' : ''} handleSelect={() => {if (isTurn){onChoiceAction(card)}}}></Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const attack = (card: MagicCard, player: Player) => {
  let damage = Math.max(card.damage - (player.mana || 0), 0);
  if (player.mana){player.mana -= 1;if (player.mana <= 0) {player.mana = undefined;}}
  if (player.activeCards.length == 0){
    if (player.shield){
      player.shield = false;
    }
    else {
      let health = player.health - damage;
      player.health = health;
    }
  } else {
    let activeCards = player.activeCards;
    activeCards[activeCards.length - 1].health -= damage;
    if (activeCards[player.activeCards.length - 1].health < 1){
      activeCards[player.activeCards.length - 1].health = activeCards[player.activeCards.length - 1].realHealth;
      activeCards.pop();
    }
    player.activeCards = activeCards;
  };
  return player;
}

export function MagicCard() {
  const [player1, setPlayer1] = useState<Player>({
    name: 'Player 1',
    deck: makeDeck(10),
    health: 100,
    pfp: makeCharacter(),
    activeCards: []
  })
  const [player2, setPlayer2] = useState<Player>({
    name: 'Player 2',
    deck: makeDeck(10),
    health: 100,
    pfp: makeCharacter(),
    activeCards: []
  })
  const [turn, setTurn] = useState(player1);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (player1.poisonCounter){setPlayer1({...player1, health: player1.health - 2, poisonCounter: player1.poisonCounter - 1});}
    if (player1.mana){setPlayer1({...player1, mana: player1.mana - 1});}
    if (player2.poisonCounter){setPlayer2({...player2, health: player2.health - 2, poisonCounter: player2.poisonCounter - 1});}
    if (player1.mana){setPlayer1({...player1, mana: player1.mana - 1});}
    if (player1.health <= 0 || player2.health <= 0){
      setGameOver(true);
    }
  }, [turn])
  if (gameOver){
    return (
      <div className="min-h-screen">
        <h1 className='text-center text-4xl'>GAME OVER: {player1.health > 0 ? player1.name : player2.name} WINS</h1>
        <DeadPlayerZone player={player1} onChoiceAction={() => {}} isTurn={false}></DeadPlayerZone>
        <DeadPlayerZone player={player2} onChoiceAction={() => {}} isTurn={false}></DeadPlayerZone>
      </div>
    )
  }
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden">
        <div className="p-10">
          <h1 className="text-4xl font-bold text-center mb-8">Magic Card Game</h1>
          <div className='flex flex-col md:flex-row'>
          <PlayerZone isTurn={turn.name === player1.name} onChoiceAction={(card) => {
            let AttackedPlayer2 = attack(card, player2);
            let [newPlayer1, newPlayer2] = useUniqueAbility(card, player1, AttackedPlayer2);
            setPlayer1(newPlayer1);
            setPlayer2(newPlayer2);
            setTurn(turn.name === player1.name ? player2 : player1)
          }} player={player1}></PlayerZone>
          <PlayerZone isTurn={turn.name === player2.name} onChoiceAction={(card) => {
            let AttackedPlayer1 = attack(card, player1);
            let [newPlayer2, newPlayer1] = useUniqueAbility(card, player2, AttackedPlayer1);
            setPlayer1(newPlayer1);
            setPlayer2(newPlayer2);
            setTurn(turn.name === player1.name ? player2 : player1)
          }} player={player2}></PlayerZone>
          </div>
          <h2 className='text-center text-2xl mt-5'>{turn.name}'s turn. Either Select a card, draw a card, or attack</h2>
          <div className='flex flex-row justify-center'>
          <button className='mt-10 mb-5 bg-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
          onClick={() => {
            if (turn.name === player1.name) {
              setPlayer1({
                ...player1,
                deck: [...player1.deck, ...makeDeck(1)],
              })
            } else {
              setPlayer2({
                ...player2,
                deck: [...player1.deck, ...makeDeck(1)],
              })
            }
            setTurn(turn.name === player1.name ? player2 : player1)
          }}
          >Draw a card</button>
          </div>
          <div className='grid grid-cols-1 align-middle md:grid-cols-3 lg:grid-cols-4'>
              {turn.deck.map((card, index) => (
                <Card className="hover:rotate-3 transition-all ml-auto mr-auto" card={card} key={index} handleSelect={() => {
                  if (turn.name === player1.name) {
                    setPlayer1({
                      ...player1,
                      activeCards: [...player1.activeCards, player1.deck[index]],
                      deck: player1.deck.filter((_, i) => i !== index)
                    })
                  } else {
                    setPlayer2({
                      ...player2,
                      activeCards: [...player2.activeCards, player2.deck[index]],
                      deck: player2.deck.filter((_, i) => i !== index)
                    })
                  }
                  setTurn(turn.name === player1.name ? player2 : player1)
                }}></Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
