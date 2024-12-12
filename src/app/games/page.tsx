import { Container } from '@/components/Container'
import { type Metadata } from 'next'
import chessImage from '@/images/photos/Chess.png';
import Image from 'next/image';


export const metadata: Metadata = {
  title: 'Games',
  description:
    'I’m Ori Raisfeld. I"m a fullstack developer with 2+ years of experience',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <h1 className='text-4xl text-center mb-10'>Select a game:</h1>
      <div className='flex flex-row items-center justify-center md:grid md:grid-flow-col md:grid-cols-3'>
        <div className='h-64 w-64'>
          <a href='/games/chess'>
          <Image alt='' className='h-full w-full blur-sm opacity-45' src={chessImage}>
            </Image>
            <h3 className='text-center absolute w-64 -translate-y-32 text-2xl font-bold text-black'>Chess</h3>
            </a>
        </div>
      </div>
    </Container>
  )
}
