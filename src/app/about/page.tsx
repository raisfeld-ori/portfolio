import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    'I’m Ori Raisfeld. I"m a fullstack developer with 2+ years of experience',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            I’m Ori Raisfeld, Here's my story
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              I started off as a 'exceptional' middle school student at Sharet, where I was part of
              the ministery of education's classes for gifted students. my future was basically guranteed!
              but I didn't see it that way.
            </p>
            <p>
              I saw the path ahead, and despite being a "perfect" future, I didn't see it that way.
              everyone walked the same path, doing the same thing, and they all ended up doing the same thing.
              For most of my life, I was fine with that, thinking that I was doing the right thing, but one day
              this all changed.
            </p>
            <p>
              A person came to our school to talk about how great is life is if we continue this path,
              but I could feel the desparation coming from that person. despite saying how fun it would be,
              she seemed sadder than anyone I had every seen. the reason was simple: despite having a great
              job and a family, she missed one important thing: importance. when another student asked her about
              her job, and what she did in the past, she couldn't recall doing a single thing she felt truly changed someone's life.
            </p>
            <p>
              and so, I decided to quit the gifted program and move to the highschool Chamama, where
              I started studying computer science in the Open university.
            </p>
            <p>
              ever since then, I kept on learning Computer science, making apps, building websites.
              all in the hopes of one day creating something truly important and useful.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink href="https://github.com/raisfeld-ori" icon={GitHubIcon} className="mt-4">
              Follow on GitHub
            </SocialLink>
            <SocialLink href="https://www.linkedin.com/in/ori-raisfeld-422392264/" icon={LinkedInIcon} className="mt-4">
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:raisfeldori@gmail.com"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              raisfeldori@gmail.com
            </SocialLink>
            <SocialLink
              href="mailto:ori.ri@chamama.org"
              icon={MailIcon}
              className="mt-4"
            >
              ori.ri@chamama.org
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
