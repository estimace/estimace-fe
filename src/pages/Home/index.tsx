import { FC } from 'react'

import { LinkButton } from 'app/ui/LinkButton'
import { Link } from 'app/ui/Link'
import { Headline } from 'app/ui/Headline'
import { Text } from 'app/ui/Text'
import { Page } from 'app/ui/layout/Page'

import styles from './index.module.css'

const HomePage: FC = () => {
  return (
    <Page>
      <div className={styles.homePageWrapper}>
        <section>
          <Headline tag="h1">Estimace: a minimal planning poker app</Headline>
          <Text tag="p">
            For estimating stories and tasks in your Agile team, give Estimace a
            try! It's a fast, real-time, and open-source tool that hones in on
            the essentials, creating a collaborative space known as a "room."
            Team members can easily join the room using a shared URL. Right now,
            Estimace offers support for two popular estimation techniques:
            Fibonacci and T-Shirt sizing.
          </Text>
          <LinkButton to="/r">Create A Room</LinkButton>
        </section>
        <section>
          <Headline tag="h2" size={200}>
            About Estimace
          </Headline>
          <Text tag="p">
            I'm Tahereh Pourkhalil, the creator of Estimace. I wanted to try
            some new programming tools for a side project and thought a planning
            poker app would be a great idea. Keeping it simple and minimalistic
            was my goal, and that's how Estimace came to be. Thanks for using
            it! I hope you enjoy it as much as I enjoyed making it. If you did,
            I'd really appreciate it if you could spread the word about
            Estimace, both offline and online.
          </Text>
          <Text tag="p">
            Estimace is an MIT licensed open-source project (
            <Link to="https://github.com/estimace/">GitHub</Link>), so feel free
            to fork it or host it yourself. You can follow me on{' '}
            <Link to="https://github.com/taherehpourkhalil">GitHub</Link> or{' '}
            <Link to="https://x.com/iamyaghish">Twitter (X)</Link>, and you're
            always welcome to reach out via email at
            taherehpourkhalil.m@gmail.com.
            <br />
            Looking forward to connecting!
          </Text>
        </section>
      </div>
    </Page>
  )
}

export default HomePage
