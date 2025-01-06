"use client"
import {GoogleGenerativeAI} from '@google/generative-ai';
import { useState } from 'react'
import Image from 'next/image'
import { createAvatar } from '@dicebear/core';
import { openPeeps } from '@dicebear/collection';
import { key } from './key';

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});

function create_enemy(){
    return createAvatar(openPeeps, {seed: Math.floor(Math.random() * 1000 + (Date.now() / 1000)).toString()}).toDataUri();
}

function callAI(prompt: string) {
    return model.generateContent(prompt);
}

async function do_turn(decision: string, health: number, items: string[]) {
    const prompt = `
    You're part of an RPG game, your goal is to describe what happens next during this fight.
    You're given the following information:
    Player health, Player items, Player decision.

    Use them to Decide next turn. Describe the action in detail, but don't add info like the player's new health or the enemy's new health.

    Example:
    Player health: 100
    Player items: [gun, knife]
    Player decision: attack using knife
    Result:
    Player attacks using knife, but misses and cuts themselves accidentally.

    Here are the player stats:
    Player health: ${health}
    Player items: ${items.join(', ')}
    Player decision: ${decision}

    What happens next?
    `

    const result = (await callAI(prompt)).response.text();

    const healthPrompt = `
    You're part of an AI RPG, You're given a description of what happend in the game, and You need to decide how much health was gained
    or lost. Write the new health of the player Don't write any other info, only the health number. Respond with the exact number.

    Example:
    health: 100
    prompt: Player attacks using knife, but misses and cuts themselves accidentally.
    Result: 80

    health: 100
    prompt: Player steals the gun, but as the monster sees him, it strikes at his back. he loses 10 hp
    Result: 90

    Here's the current turn:
    ${result}
    `;
    const newHealth = Number((await callAI(healthPrompt)).response.text());

    const itemsPrompt = `
    You're part of an AI RPG, You're given a description of what happend in the game, and You need to decide Which items do the player own.
    Respond using only every item, followed by ',', for example: item1,item2,item3
    Here are some examples:
    Example:
    Items: [gun, knife]
    prompt: Player attacks using knife, but misses and cuts themselves accidentally.
    Result: gun,

    Items: [apple, banana, orange]
    prompt: Player eats apple and heals a bit
    Result: banana,orange


    Respond with "No items" if there's no items.
    Here's the current turn:
    items: ${items.join(', ')}
    prompt: ${result}
    `;

    const enemyPrompt = `
    You are part of an AI rpg game, your job is to describe how much health the enemy has.
    You're given the current enemies health and the last action, decide how much health did the enemy lose.
    Respond with the exact number and no other content. Respond using a number only.

    Example:
    Health: 100
    Prompt: Player attacks using knife and stabs the orc
    Result: 80

    Health: 100
    Prompt: Player eats apple and heals a bit
    Result: 100

    Current turn:
    Health: ${health}
    Prompt: ${result}
    `

    const newEnemyHealth = Number((await callAI(enemyPrompt)).response.text());

    const newItems = (await callAI(itemsPrompt)).response.text();

    return {message: result, health: newHealth, items: newItems == "No items" ? [] : newItems.split(','), enemyHealth: newEnemyHealth};
}

function Enemy({enemy, health} : {enemy: string, health: number}) {
  return (
    <div className="flex items-center flex-col justify-center">
        <p><strong>Enemy health: </strong>{health}</p>
      <Image 
        src={enemy} 
        alt="Enemy" 
        width={300} 
        height={300}
        className="rounded-lg shadow-lg"
      />
    </div>
  )
}

interface UserStatsProps {
  health: number
  items: string[]
}

function UserStats({ health, items }: UserStatsProps) {
  return (
    <div className="flex-1 p-4 shadow-lg overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Health</h2>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{health}</span>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Items</h2>
        <ul>
          {items.map((item, index) => (
            item.trim() != "" &&
            <li key={index} className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

interface UserInputProps {
  onSubmit: (action: string) => void
  disabled: boolean
}

function UserInput({ onSubmit, disabled }: UserInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full shadow-lg">
      <div className="flex p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your action..."
          disabled={disabled}
          className="flex-1 mr-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={disabled}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </div>
    </form>
  )
}

interface ActionModalProps {
  isOpen: boolean
  onClose: () => void
  health: number
  enemyHealth: number
  items: string[]
  message: string
}

function ActionModal({ isOpen, onClose, health, enemyHealth, items, message }: ActionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center blur-none">
      <div className="p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Result</h2>
        <p className="mb-4">{message}</p>
        <div className="mb-4">
          <p><strong>Health: </strong> {health}</p>
          <p><strong>Enemy health: </strong> {enemyHealth}</p>
        </div>
        {items.length > 0 && (
          <div className="mb-4">
            <p><strong>Items: </strong></p>
            <ul className="list-disc list-inside">
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default function AiRpg() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<{ health: number; items: string[], message: string }>({ health: 0, items: [], message: "" })
  const [health, setHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [disabled, setDisabled] = useState(false);
  const [enemy, setEnemy] = useState(create_enemy());
  const [items, setItems] = useState<string[]>([])

  const handleUserAction = async (action: string) => {
    setDisabled(true);
    const turn = await do_turn(action, health, items);

    setHealth(Math.min(Math.max(0, turn.health), 100));
    setItems(turn.items)

    setModalContent({
      health: turn.health,
      items: turn.items,
      message: turn.message
    })
    setEnemyHealth(turn.enemyHealth)
    if (enemyHealth <= 0) {setEnemy(create_enemy());setEnemyHealth(100);}
    setIsModalOpen(true)
  }
  return (
    <div className="flex flex-col h-screen ">
      <div className={`flex-1 flex ${isModalOpen ? 'blur-sm' : ''}`}>
        <div className="w-1/4 flex flex-col">
          <UserStats health={health} items={items} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Enemy enemy={enemy} health={enemyHealth}/>
        </div>
      </div>
      <UserInput onSubmit={handleUserAction} disabled={disabled} />
      <ActionModal 
        isOpen={isModalOpen} 
        onClose={() => {setIsModalOpen(false);setDisabled(false);}}
        enemyHealth={enemyHealth}
        health={modalContent.health}
        message={modalContent.message}
        items={modalContent.items}
      />
    </div>
  )
}