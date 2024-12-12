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
      <div className='grid grid-flow-col grid-cols-3'>
        <div className='h-16 w-16 md:h-64 md:w-64'>
          <a href='/games/chess'>
          <Image alt='' className='h-full w-full blur-sm opacity-45' src={chessImage}>
            </Image>
            <h3 className='text-center absolute w-16 mb-8 md:w-64 md:mb-64 text-xl font-bold text-black'>Chess</h3>
            </a>
        </div>
      </div>
    </Container>
  )
}
