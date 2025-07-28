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
          <Headline tag="h1" size={300}>Estimace: A lightweight tool for agile story point estimation</Headline>
          <Headline tag="h2" size={200}>Built for distributed teams who want to estimate and move on.</Headline>
          <Text tag="p">
            Estimace is a fast, real-time, and open-source estimation tool for agile teams. 
            It helps you estimate stories and tasks with minimal friction and zero distractions.</Text> 
            <Text tag="p">
            Create a collaborative space called a "room" where team members can join instantly using a simple URL.
            Estimace offers support for two widely used estimation techniques:
            Fibonacci and T-Shirt sizing.
          </Text>
          <Text tag="p">
            Stay focused on what matters. Skip the boards. Forget the clutter. 
            just clean, and collaborative estimation.</Text>
          <LinkButton to="/r">Create A Room</LinkButton>
        </section>
        <section>
          <Headline tag="h2" size={200}>
            About Estimace
          </Headline>
          <Text tag="p">
            Hi, I’m Tahereh Pourkhalil, the developer behind Estimace.{' '} 
            I built this tool as a side project while exploring new programming stacks.{' '}
            I wanted to create something simple, useful, and focused for distributed dev teams.{' '}
          </Text>
          <Text tag="p">
            Estimace is an MIT licensed open-source project (
            <Link to="https://github.com/estimace/">GitHub</Link>){' '}<br />
            You can check out the code on GitHub, fork it, or even self-host it.{' '}
            If you find Estimace helpful, feel free to share it with others.{' '}
            You can also reach me anytime at taherehpourkhalil.m@gmail.com. or, follow me on <Link to="https://github.com/taherehpourkhalil">GitHub</Link>{' '}
            <br />
            I’d love to hear your feedback.
          </Text>
        </section>
      </div>
    </Page>
  )
}

export default HomePage
