import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Uses',
  description: 'Software I use, gadgets I love, and other things I recommend.',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="My favorite tools."
      intro="I get asked a lot about my favorite frameworks, my most used tools, and stuff like that. so here's my favorite and most used tools of all time."
    >
      <div className="space-y-20">
        <ToolsSection title="General tools">
          <Tool title="Windows 11 / Linux-Manjaro / Linux-Debian">
            I have been using linux and linux, and never felt any reason to move to any other operating systems.
            Windows 11 is mediocare, but it can run basically anything I want, which makes it useful for day-to-day usage.
            Manjaro is a great arch based operating system, and my favorite linux distro.
            Debian isa close second, but unlike manjaro, it's more stable and more secure, yet not as flexible as Manjaro.
          </Tool>
          <Tool title="Visual Studio Code">
            My most used code editor. very useful for general purpose programming. I used it for learning new language,
            and I used it for making large scale products, it truly works everywhere, for any language, and always gives
            the same simple and consistent experience.
          </Tool>
          <Tool title="Neovim">
            Unlike Vscode, this is a less used tool of mine, but still a very useful one.
            It's useful as a lightwheight editor that works anywhere from a large computer to a miniature
            mobile phone. It's great for smaller projects/
          </Tool>
          <Tool title="Jetbrains products">
            this is my most spesific list of tools. Unlike neovim and vscode, every
            jetbrains product only fits one programming language and requires a very strong
            computer to use properly. however, when the situation is right, a Jetbrains product can be
            one of the best IDEs you can get.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Development tools">
          <Tool title="Tauri">
            It's a framework that makes it easy to build cross-platform apps with Rust and React, what
            more can I say? Now that it supports Android and IOS, It's become my #1 most used development
            tool for app and mobile development.
          </Tool>
          <Tool title="Expo">
            Whenever Tauri isn't enough, and I need more control and performance, I use React native with expo.
            as simple as that. it's a great tool, but it's not good at making websites, 
            so React is still better than React Native for any other case. also, Expo takes the process of making
            an android/IOS app and simplifies it a lot, I love that tool.
          </Tool>
          <Tool title="Firebase">
            Whenever I have to make a simple backend, without the need for something complex, I usually
            use Firebase. It's very simple to use, and it's very easy to get started.
          </Tool>
          <Tool title="React">
            I tried multiple frameworks, from Qt to Angular to Svelte, but none of them felt
            like I could create UI without wasting a ton of times on non-UI related things.
            That is, until I met react. It's my #1 used framework of all time.
          </Tool>
          <Tool title="Nextjs">
            Although not as useful as React, Nextjs is also good for making websites like this.
            It has every benefit of React, but also a couple good (and bad) featires alongside it.
            I usually use it for large scale websites, but it can be used for small projects as well.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Languages">
          <Tool title="Python">
            A simple, abstract programming language that allows making very complicated things without
            requiring a lot of effort. It's useful for most scenarios, unless I need to do something more complicated.
          </Tool>
          <Tool title="Rust">
            The opposite of python. It's a complicated, low level programming language that gives a lot of control over
            the system, in return for a lot of effort. It's useful for making very complicated things, but it's also good for
            making things fast wihtout trying too hard.
          </Tool>
          <Tool title="Java">
            The opposite of python. It's a complicated, low level programming language that gives a lot of control over
            the system, in return for a lot of effort. It's useful for making very complicated things, but it's also good for
            making things fast wihtout trying too hard.
          </Tool>
          <Tool title="Typescript">
            The opposite of python. It's a complicated, low level programming language that gives a lot of control over
            the system, in return for a lot of effort. It's useful for making very complicated things, but it's also good for
            making things fast wihtout trying too hard.
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
